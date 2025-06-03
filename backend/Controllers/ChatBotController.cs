using APIbackend.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using APIbackend.Models;

namespace APIbackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ChatBotController : ControllerBase
    {

        private readonly ChatAiContext _chatContext;
        private readonly ProductsContext _productsContext;

        public ChatBotController(ChatAiContext chatContext, ProductsContext productsContext)
        {
            _chatContext = chatContext;
            _productsContext = productsContext;
        }
        //api hỏi chat
        [HttpPost("ask")]
        public async Task<IActionResult> Ask([FromBody] ChatAi chatAi)
        {
            if (chatAi == null || string.IsNullOrWhiteSpace(chatAi.Message))
                return BadRequest("Message is required.");

            // Lưu tin nhắn user
            var userMessage = new ChatAi { Message = chatAi.Message.Trim() };
            _chatContext.ChatAis.Add(userMessage);
            await _chatContext.SaveChangesAsync();

            // Lấy danh sách sản phẩm
            var products = await _productsContext.Products.ToListAsync();
            var productJson = JsonSerializer.Serialize(products);

            // Lấy tất cả các tin nhắn trước đó (chỉ message)
            var messages = await _chatContext.ChatAis.ToListAsync();
            var messagesJson = JsonSerializer.Serialize(messages.Select(m => m.Message));

            // Tạo payload gửi AI
            var requestBody = new
            {
                model = "deepseek/deepseek-r1:free",
                messages = new[]
                {
                    new
                    {
                        role = "user",
                        content =
                            $"Bạn là trợ lý AI bán hàng của một shop đồ chơi. Hãy dựa vào danh sách sản phẩm sau: {productJson} " +
                            $"và nội dung cuộc trò chuyện trước đó: {messagesJson}. " +
                            $"Câu hỏi mới của khách là: \"{chatAi.Message}\". " +
                            $"Hãy trả lời một cách ngắn gọn, thân thiện và gợi ý đúng sản phẩm phù hợp nếu có. " +
                            $"Nếu chưa đủ thông tin, hãy hỏi lại để làm rõ nhu cầu của khách."
                    }
                }
            };

            var apiKey = "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";

            using var httpClient = new HttpClient();
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);

            var content = new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json");
            var response = await httpClient.PostAsync("https://openrouter.ai/api/v1/chat/completions", content);

            if (!response.IsSuccessStatusCode)
                return StatusCode((int)response.StatusCode, await response.Content.ReadAsStringAsync());

            var responseString = await response.Content.ReadAsStringAsync();

            string aiMessage = null;
            try
            {
                using var doc = JsonDocument.Parse(responseString);
                var choices = doc.RootElement.GetProperty("choices");
                if (choices.GetArrayLength() > 0)
                {
                    var message = choices[0].GetProperty("message");
                    aiMessage = message.GetProperty("content").GetString();
                }
            }
            catch
            {
                return StatusCode(500, "Error parsing AI response.");
            }

            if (string.IsNullOrEmpty(aiMessage))
                return StatusCode(500, "No AI response found.");

            // Lưu tin nhắn assistant
            var assistantMessage = new ChatAi { Message = aiMessage };
            _chatContext.ChatAis.Add(assistantMessage);
            await _chatContext.SaveChangesAsync();

            return Ok(new { answer = aiMessage });
        }
    }
}

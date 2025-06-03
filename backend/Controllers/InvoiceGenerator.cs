using QuestPDF.Fluent;
using QuestPDF.Infrastructure;
using QuestPDF.Helpers;
using System.IO;
using APIbackend.Data;

namespace APIbackend.Controllers
{
    public class InvoiceGenerator
    {
        static InvoiceGenerator()
        {
            QuestPDF.Settings.License = LicenseType.Community;
        }   
        private static string GetStatusText(int status)
        {
            return status switch
            {
                0 => "Thanh toán khi nhận hàng",
                1 => "Đã thanh toán online",
                2 => "Đang giao hàng",
                3 => "Hoàn tất",
                4 => "Đã hủy",
                _ => "Không rõ"
            };
        }

        public static byte[] GenerateInvoice(Payment payment)
        {
            var stream = new MemoryStream();

            Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Margin(40);
                    page.DefaultTextStyle(x => x.FontFamily("Arial").FontSize(12));

                    // HEADER
                    page.Header().BorderBottom(1).BorderColor("#DDDDDD").PaddingBottom(15).Column(col =>
                    {
                        col.Item().Row(row =>
                        {
                            row.RelativeItem().Column(c =>
                            {
                                c.Item().Text("FIGURESHOP").Bold().FontSize(28).FontColor("#2196F3");
                                c.Item().Text("Website: www.FigureShop.com").FontSize(10).FontColor("#666666");
                                c.Item().Text("Hotline: 0342 088 618 (Mr Vượng)").FontSize(10).FontColor("#666666");
                            });
                        });
                    });
                    // CONTENT
                    page.Content().PaddingVertical(30).Column(col =>
                    {
                        // Tiêu đề hóa đơn
                        col.Item().Background("#F0F4FF").Padding(15).Column(c =>
                        {
                            c.Item().Text("HÓA ĐƠN THANH TOÁN").SemiBold().FontSize(20).FontColor("#1565C0");
                            c.Item().Text($"Mã hóa đơn: {payment.PaymentId}").FontSize(12).FontColor("#666666");
                            c.Item().Text($"Ngày tạo: {payment.CreatedDate:dd/MM/yyyy HH:mm}").FontColor("#666666");
                        });

                        // Thông tin khách hàng
                        col.Item().PaddingVertical(20).Column(c =>
                        {
                            c.Item().Text("THÔNG TIN KHÁCH HÀNG").SemiBold().FontSize(14).FontColor("#333333");
                            c.Item().PaddingTop(5).Text($"Họ tên: {payment.customerName}");
                            c.Item().PaddingTop(5).Text($"SĐT: {payment.Phonerecei}");
                            c.Item().PaddingTop(5).Text($"Địa chỉ: {payment.Address}");
                            c.Item().PaddingTop(5).Text($"Hình thức thanh toán: {GetStatusText(payment.Paymentstatus)}").SemiBold().FontColor("#FF0000");
                        });

                        // Danh sách sản phẩm
                        col.Item().PaddingTop(30).Column(c =>
                        {
                            c.Item().Text("CHI TIẾT SẢN PHẨM").SemiBold().FontSize(14).FontColor("#333333");

                            c.Item().Table(table =>
                            {
                                table.ColumnsDefinition(columns =>
                                {
                                    columns.ConstantColumn(40);
                                    columns.ConstantColumn(80);
                                    columns.RelativeColumn(2);
                                    columns.RelativeColumn(1);
                                    columns.RelativeColumn(1);
                                    columns.RelativeColumn(1);
                                });

                                // Header
                                table.Header(header =>
                                {
                                    header.Cell().Element(CellStyle).AlignCenter().Text("Mã").Bold();
                                    header.Cell().Element(CellStyle).AlignCenter().Text("Ảnh").Bold();
                                    header.Cell().Element(CellStyle).AlignCenter().Text("Tên sản phẩm").Bold();
                                    header.Cell().Element(CellStyle).AlignCenter().Text("SL").Bold();
                                    header.Cell().Element(CellStyle).AlignCenter().Text("Đơn giá").Bold();
                                    header.Cell().Element(CellStyle).AlignCenter().Text("Thành tiền").Bold();
                                });


                                // Dữ liệu từng dòng
                                foreach (var item in payment.PaymentDetails)
                                {
                                    table.Cell().Element(CellStyle).Text(item.Product.Id ?? "");

                                    // Căn chỉnh cột ảnh một cách an toàn
                                    table.Cell().Element(container =>
                                    {
                                        container
                                            .Height(70)
                                            .AlignMiddle()
                                            .AlignCenter()
                                            .Element(imageContainer =>
                                            {
                                                var relativePath = item.Product.ImagePath?.TrimStart('/');
                                                var fullPath = Path.Combine("wwwroot", relativePath ?? "");

                                                if (File.Exists(fullPath))
                                                {
                                                    imageContainer.Image(fullPath).FitArea();
                                                }
                                                else
                                                {
                                                    imageContainer
                                                        .Background("#EEEEEE")
                                                        .AlignMiddle()
                                                        .AlignCenter()
                                                        .Text("Không ảnh")
                                                        .FontSize(8)
                                                        .FontColor("#999999");
                                                }
                                            });
                                    });

                                    table.Cell().Element(CellStyle).AlignCenter().Text(item.Product.Name);
                                    table.Cell().Element(CellStyle).AlignCenter().Text(item.Stock.ToString());
                                    table.Cell().Element(CellStyle).AlignCenter().Text($"{item.Product.Price:N0}");
                                    table.Cell().Element(CellStyle).AlignCenter().Text($"{(item.Stock * item.Product.Price):N0}");
                                }

                                static IContainer CellStyle(IContainer container) =>
                                    container.PaddingVertical(10).BorderBottom(1).BorderColor("#DDDDDD");
                            });
                        });

                        // Ghi chú và tổng tiền
                        col.Item().PaddingTop(30).Background("#FFF8E1").Padding(15).Column(c =>
                        {
                            c.Item().Text("Ghi chú:").FontColor("#FB8C00").SemiBold();
                            c.Item().Text(payment.Note ?? "- Không có ghi chú");

                            c.Item().PaddingTop(15).Row(row =>
                            {
                                row.RelativeItem().Text("TỔNG CỘNG:").FontSize(14).FontColor("#1565C0").Bold();
                                row.RelativeItem().AlignRight().Text($"{payment.sum:N0} VND").FontSize(14).Bold().FontColor("#1565C0");
                            });
                        });
                    });

                    // FOOTER
                    page.Footer().BorderTop(1).BorderColor("#DDDDDD").PaddingTop(15).Row(row =>
                    {
                        row.RelativeItem().Column(col =>
                        {
                            col.Item().Text("Cảm ơn quý khách đã mua hàng!").FontSize(12).FontColor("#666666");
                            col.Item().PaddingTop(5).Text("© 2025 FIGURESHOP").FontSize(10).FontColor("#999999");
                        });
                        row.RelativeItem().AlignRight().Text(text =>
                        {
                            text.CurrentPageNumber();
                            text.Span(" / ");
                            text.TotalPages();
                        });
                    });
                });
            }).GeneratePdf(stream);

            return stream.ToArray();
        }
    }
}
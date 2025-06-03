using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
namespace APIbackend.Data
{
    public class Update_history
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public int modify_paymentsid { get; set; }
        public int modify_status { get; set; }
        public int modify_userid { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}

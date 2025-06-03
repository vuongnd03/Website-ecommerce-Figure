import styles from '../Css/Policies.module.css';
export default function CsThanhToan(){
    return(<div>
        <div className={styles.tieude}>
            <h1>Chính Sách Thanh Toán</h1>
            <h2>Chính Sách Thanh Toán</h2>
            <p>Hình thức thanh thoán Hình thức mua hàng và thanh toán tại hệ thống mohinhgiaxuong.com được thực hiện như sau</p>
        </div>
        <div className={styles.content}>
            <h1>1. Phương thức giao hàng – Trả tiền</h1>
            <p>a. Thanh Toán khi nhận hàng : Đối với những khách hàng đặt hàng qua website mohinhfirgue.com thì sẽ thanh toán tiền khi khách hàng nhận được hàng</p>
            <p>b. Thanh Toán Trước : Chuyển tiền, chuyển khoản, thanh toán trực tiếp bằng tiền mặt tại văn phòng của chúng tôi. Hình thức chuyển tiền/chuyển khoản qua ngân hàng</p>
        </div>
    </div>)
}
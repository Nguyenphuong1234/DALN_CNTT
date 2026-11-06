
# Travel Mate – Website đặt phòng du lịch trực tuyến tích hợp AI
## Sinh viên thực hiện
- Đồng Thị Ánh - 23013883
- Bùi Thị Hồng Tươi - 23015124
- Nguyễn Minh Phương - 23015738
## Giới thiệu

Travel Mate là hệ thống website đặt phòng du lịch trực tuyến tích hợp trí tuệ nhân tạo (AI), giúp kết nối khách hàng với các cơ sở lưu trú. Hệ thống hỗ trợ người dùng tìm kiếm khách sạn, xem thông tin phòng, đặt phòng và thanh toán trực tuyến.

Ngoài ra, hệ thống tích hợp AI Travel Mate nhằm hỗ trợ tư vấn du lịch, giải đáp thắc mắc và gợi ý phòng phù hợp với nhu cầu của khách hàng.

## Chức năng chính

### 1. Khách hàng (Customer)
- Đăng ký, đăng nhập tài khoản.
- Đăng nhập bằng Google.
- Quản lý thông tin cá nhân.
- Tìm kiếm và lọc khách sạn.
- Xem thông tin khách sạn và chi tiết phòng.
- Đặt phòng trực tuyến.
- Thanh toán trực tuyến qua VNPAY.
- Xem lịch sử đặt phòng.
- Hủy đặt phòng và yêu cầu hoàn tiền.
- Đánh giá và nhận xét khách sạn.
- Gửi yêu cầu đăng ký đối tác.
- Tư vấn du lịch bằng AI Chatbot.
- Nhận gợi ý phòng phù hợp.

### 2. Chủ khách sạn (Owner)
- Quản lý thông tin khách sạn.
- Quản lý loại phòng và phòng.
- Quản lý đơn đặt phòng.
- Xác nhận khách nhận phòng và trả phòng.
- Quản lý tình trạng phòng.
- Xử lý trường hợp khách không đến.
- Theo dõi doanh thu.
- Quản lý đánh giá của khách hàng.

### 3. Quản trị viên (Admin)
- Quản lý tài khoản người dùng.
- Quản lý chủ khách sạn và đối tác.
- Kiểm duyệt thông tin khách sạn.
- Quản lý trạng thái khách sạn.
- Quản lý yêu cầu hoàn tiền.
- Đối soát thanh toán.
- Quản lý đánh giá và khiếu nại.

## 🛠️ Công nghệ sử dụng

| Thành phần | Công nghệ |
|---|---|
| Backend | PHP, Laravel |
| Frontend | HTML, CSS, JavaScript |
| Database | MySQL |
| Công cụ phát triển | Visual Studio Code |
| Quản lý cơ sở dữ liệu | phpMyAdmin |
| Môi trường chạy | XAMPP |
| Thanh toán | VNPAY Sandbox |
| Đăng nhập | Google OAuth |
| Bản đồ | OpenStreetMap |
| Trí tuệ nhân tạo | OpenAI Responses API |

## Kiến trúc hệ thống

Hệ thống được xây dựng theo kiến trúc 3 lớp kết hợp mô hình MVC (Model – View – Controller), giúp phân chia rõ ràng giữa giao diện, xử lý nghiệp vụ và dữ liệu.

## Mục tiêu đề tài

- Xây dựng nền tảng đặt phòng trực tuyến thuận tiện.
- Hỗ trợ khách hàng tìm kiếm và đặt phòng nhanh chóng.
- Hỗ trợ chủ khách sạn quản lý hoạt động kinh doanh.
- Hỗ trợ quản trị viên kiểm soát và vận hành hệ thống.
- Ứng dụng AI vào tư vấn du lịch và gợi ý phòng.


## Hướng phát triển

- Hoàn thiện tích hợp thanh toán trong môi trường thực tế.
- Nâng cao chất lượng tư vấn và gợi ý của AI.
- Tối ưu hiệu năng và bảo mật hệ thống.
- Triển khai hệ thống trên máy chủ thực tế.
- Mở rộng khả năng quản lý và hỗ trợ nhiều cơ sở lưu trú.

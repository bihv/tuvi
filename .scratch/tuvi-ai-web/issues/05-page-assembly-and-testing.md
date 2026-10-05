# Issue 05: Lắp ráp Ứng dụng Hoàn chỉnh, Trang Quản lý & Kiểm thử End-to-End

Status: done

## Mô tả
1. Lắp ráp trang chủ `pages/index.vue`:
   - Trạng thái 1: Khi chưa có lá số -> hiển thị Form nhập liệu đẹp mắt, mời gọi.
   - Trạng thái 2: Sau khi lập lá số -> hiển thị Thiên Bàn + Lá số 12 cung + Nút xem Báo cáo AI hoặc Trò chuyện.
2. Xây dựng trang danh bạ `pages/history.vue` (hoặc modal Drawer danh bạ):
   - Danh sách các lá số đã lưu trong LocalStorage.
   - Cho phép chọn nhanh để xem lại, đổi tên hoặc xóa.
3. Header & Navigation:
   - Logo tối giản "Tử Vi AI".
   - Nút chuyển Dark/Light mode của Nuxt UI.
   - Nút truy cập danh sách lá số đã lưu.
4. Kiểm thử toàn diện:
   - Kiểm tra tính toán an sao với các mốc thời gian đặc biệt (giờ Tý đổi ngày, năm nhuận âm lịch).
   - Kiểm tra luồng gọi API LLM streaming.
   - Kiểm tra tính năng lưu/phục hồi LocalStorage qua Pinia.

## Tiêu chí hoàn thành (Acceptance Criteria)
- [x] Ứng dụng chạy mượt mà, không có lỗi console hay hydration mismatch.
- [x] Quy trình từ nhập liệu -> lập lá số -> xem báo cáo AI -> chat tương tác hoạt động trơn tru.
- [x] Responsive hoàn hảo trên điện thoại di động và máy tính.

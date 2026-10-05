# Issue 04: Xây dựng Bộ UI Components Mobile-First theo Phong cách Apple Minimalist

Status: done

## Mô tả
Xây dựng các thành phần giao diện người dùng tối giản, tinh tế chuẩn Apple:
1. `components/BirthInputForm.vue`:
   - Form nhập Họ tên, Giới tính, Năm xem hạn.
   - Switch chuyển đổi Dương lịch ↔ Âm lịch.
   - Segment chọn: Giờ:phút số học HOẶC 12 Canh giờ âm lịch (Tý, Sửu, Dần...).
2. `components/ThienBanCard.vue`:
   - Thẻ thông tin đương số phong cách Apple Wallet (chữ mỏng, nền kính mờ mờ, hiển thị Can Chi, Cục, Mệnh, Thân).
3. `components/AstrolabeGrid.vue` & `components/PalaceCell.vue`:
   - Responsive:
     - Trên Mobile: Tab chuyển đổi giữa Chế độ Card Feed (vuốt xem các cung) và Chế độ Lưới thu nhỏ (Interactive Mini-Grid).
     - Trên Desktop: Lưới Modern Glass Grid 4x4 hoàn chỉnh.
4. `components/PalaceDetailSheet.vue`:
   - Trên Mobile: Bottom Sheet trượt từ đáy lên (iOS modal).
   - Trên Desktop: Slide-over Drawer từ cạnh phải.
   - Hiển thị danh sách sao tọa thủ, miếu hãm, tam hợp chiếu và khung chat riêng của cung đó.
5. `components/AiReportView.vue`:
   - Trình bày 5 mục luận giải bằng Markdown đẹp mắt, phân loại điểm nhấn rõ ràng.
6. `components/AiChatBox.vue`:
   - Khung chat tối giản sạch sẽ, input thanh mảnh với nút gửi tinh tế, hiển thị tin nhắn streaming.

## Tiêu chí hoàn thành (Acceptance Criteria)
- [x] Giao diện thích ứng hoàn hảo trên cả Mobile (<640px) và Desktop (>1024px).
- [x] Trải nghiệm vuốt chạm, mở Bottom Sheet trên mobile mượt mà, tự nhiên.
- [x] Phong cách Apple Minimalist nhất quán (viền mỏng, typography sắc nét, dark/light mode hoàn hảo).

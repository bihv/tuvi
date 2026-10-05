# Issue 02: Tích hợp Engine Tử Vi `iztro` & Xây dựng Structured Domain RAG

Status: done

## Mô tả
1. Xây dựng tiện ích bao bọc thư viện `iztro` (`server/utils/tuvi.ts` và `utils/tuvi.ts`) để:
   - Nhận thông tin sinh (Dương/Âm lịch, giờ phút hoặc 12 canh giờ).
   - Thiết lập ngôn ngữ tiếng Việt (`vi-VN`).
   - Xuất dữ liệu cấu trúc chuẩn hóa cho 12 cung, chính tinh, phụ tinh, tứ hóa, thế miếu/đắc/hãm.
2. Xây dựng kho tri thức **Structured Domain RAG** (`server/data/knowledge/`):
   - Từ điển ý nghĩa 14 chính tinh (Tử Vi, Liêm Trinh, Thiên Đồng, Vũ Khúc, Thái Dương, Thiên Cơ, Thiên Phủ, Thái Âm, Tham Lang, Cự Môn, Thiên Tướng, Thiên Lương, Thất Sát, Phá Quân).
   - Ý nghĩa các vị trí đắc/hãm tại từng cung.
   - Các bộ cách cục lớn (*Sát Phá Tham*, *Tử Phủ Vũ Tướng*, *Cơ Nguyệt Đồng Lương*...).
   - Hàm tiện ích `retrieveAstrologyContext(astrolabeData, targetPalace?)` để bốc tách tri thức chính xác nạp vào prompt cho LLM.

## Tiêu chí hoàn thành (Acceptance Criteria)
- [x] Hàm tính lá số an sao trả về kết quả chuẩn xác, đầy đủ tiếng Việt.
- [x] Dữ liệu Structured Domain RAG phủ đủ 14 chính tinh và các cung trọng yếu.
- [x] Module RAG trích xuất đúng nội dung tham chiếu cho bất kỳ lá số nào.

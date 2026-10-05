# Đặc tả Kỹ thuật: Ứng dụng Web Xem & Luận giải Tử Vi bằng AI (TuVi AI Web)

## 1. Tổng quan Dự án (Project Overview)
Xây dựng ứng dụng web hiện đại phục vụ người dùng phổ thông (B2C) tra cứu lá số Tử Vi Đẩu Số tức thì và nhận bài luận giải cố vấn cuộc sống sâu sắc bằng AI, giao diện tối giản theo phong cách Apple (Apple Minimalist), ưu tiên trải nghiệm trên thiết bị di động (Mobile-First).

---

## 2. Các Tài liệu Tham chiếu (Architecture & Domain References)
- **Từ điển nghiệp vụ chuẩn**: [GLOSSARY.md](file:///d:/project/tuvi/GLOSSARY.md)
- **ADR-0001**: [Nuxt 3 và In-Process Engine `iztro`](file:///d:/project/tuvi/docs/adr/0001-nuxt-and-in-process-engine.md)
- **ADR-0002**: [Tích hợp LLM qua chuẩn OpenAI-Compatible](file:///d:/project/tuvi/docs/adr/0002-openai-compatible-ai-endpoint.md)
- **ADR-0003**: [Tri thức RAG có cấu trúc cho Luận giải Tử Vi](file:///d:/project/tuvi/docs/adr/0003-structured-domain-rag.md)
- **ADR-0004**: [Quản lý State Pinia, TanStack Query và Client Persistence](file:///d:/project/tuvi/docs/adr/0004-client-side-storage.md)
- **ADR-0005**: [Thiết kế Giao diện Lá số Mobile-First](file:///d:/project/tuvi/docs/adr/0005-mobile-first-responsive-astrolabe.md)

---

## 3. Kiến trúc Công nghệ (Full Stack Architecture)
* **Framework**: Nuxt 3 (Vue 3, TypeScript).
* **UI & Style**: `@nuxt/ui` (Tailwind CSS, Radix Vue primitives, `@nuxt/icon`, Apple Minimalist theme, hỗ trợ Dark/Light mode).
* **Tu Vi Engine**: Thư viện `iztro` (TypeScript, in-process, tiếng Việt `vi-VN`).
* **AI Provider**: OpenAI-compatible API client kết nối linh hoạt qua `.env` (`AI_BASE_URL`, `AI_API_KEY`, `AI_MODEL_NAME`).
* **Domain RAG**: Structured Domain RAG (module TypeScript/JSON bốc tách theo sao/cung/cách cục đưa vào ngữ cảnh LLM).
* **State & Query**:
  * Client State & LocalStorage: `@pinia/nuxt` + `@pinia-plugin-persistedstate/nuxt` (`persist: true`).
  * Server State & Fetching: `@tanstack/vue-query` (qua `@hebilicious/vue-query-nuxt`) + Nitro `$fetch`.

---

## 4. Đặc tả Trải nghiệm Người dùng (UX/UI Specification)

### 4.1. Nhập liệu (Input Form)
* Họ và tên, Giới tính (Nam / Nữ).
* Năm xem vận hạn (Mặc định năm hiện tại).
* Ngày, tháng, năm sinh (Hỗ trợ chuyển đổi tab: Dương lịch / Âm lịch).
* Giờ sinh linh hoạt:
  * Lựa chọn 1: Nhập giờ:phút cụ thể (Time Picker).
  * Lựa chọn 2: Chọn theo 12 Canh giờ âm lịch (Tý: 23h-01h, Sửu: 01h-03h, Dần: 03h-05h...).

### 4.2. Hiển thị Lá số (Mobile-First Astrolabe)
* **Thiên Bàn**:
  * Thẻ tóm tắt thông tin đương số phong cách Apple Wallet (Họ tên, Năm sinh Can Chi, Bản mệnh, Cục số, Chủ Mệnh, Chủ Thân).
* **12 Cung số**:
  * **Trên Mobile**:
    * Chế độ Card Feed / Carousel: Lướt xem các cung Mệnh, Thân, Tài Bạch, Quan Lộc, Phu Thê...
    * Chế độ Interactive Mini-Grid: Ma trận 12 ô thu nhỏ trực quan.
    * Khi chạm vào Cung: Mở **Bottom Sheet** (iOS modal trượt từ đáy lên) hiển thị đầy đủ các sao chính, phụ, miếu hãm và tích hợp chat AI.
  * **Trên Desktop**:
    * Ma trận kính mờ 12 cung hoàn chỉnh (Modern Glass Grid 4x4 bao quanh Thiên Bàn).
    * Khi click vào Cung: Mở **Slide-over Drawer** từ cạnh phải màn hình.

### 4.3. Luận giải AI & Trợ lý Hỏi đáp
* **Báo cáo tổng quan 5 mục**:
  1. Tổng quan Bản Mệnh & Tính cách cốt lõi.
  2. Sự nghiệp & Cơ hội phát triển (Cung Quan Lộc).
  3. Tài lộc & Quản lý tài chính (Cung Tài Bạch).
  4. Tình duyên & Gia đạo (Cung Phu Thê).
  5. Xu hướng Vận hạn năm & Lời khuyên hành động thực tế.
  * *Văn phong*: Cố vấn tích cực, thực tế, thiết thực, tránh mê tín dị đoan.
* **Trợ lý Chat tự do**:
  * Khung chat tối giản sạch sẽ.
  * Tự động truyền ngữ cảnh lá số hiện tại và cung đang chọn (nếu có) vào phiên chat.

### 4.4. Quản lý Lá số Cục bộ (History)
* Danh sách các lá số đã lập được lưu trực tiếp trên trình duyệt (LocalStorage).
* Chuyển đổi nhanh giữa các lá số đã lưu mà không cần nhập lại.
* Xóa lá số hoặc xuất ảnh/chia sẻ.

---

## 5. Kế hoạch Triển khai (Execution Phases)
1. **Giai đoạn 1**: Khởi tạo dự án Nuxt 3, cấu hình UI, dependencies và biến môi trường.
2. **Giai đoạn 2**: Tích hợp engine `iztro` và xây dựng module Structured Domain RAG tri thức Tử Vi.
3. **Giai đoạn 3**: Xây dựng Pinia store, TanStack Query và các Nitro Server API (`/api/ai/report`, `/api/ai/chat`).
4. **Giai đoạn 4**: Xây dựng các UI component Mobile-First (Form, Thiên Bàn, 12 Cung Grid/Feed, Bottom Sheet / Drawer).
5. **Giai đoạn 5**: Lắp ráp trang hoàn chỉnh, kiểm thử tính toán lá số, kiểm tra streaming AI và tinh chỉnh thẩm mỹ Apple Minimalist.

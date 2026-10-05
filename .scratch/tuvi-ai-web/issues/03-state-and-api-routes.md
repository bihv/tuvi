# Issue 03: Xây dựng Pinia Stores, TanStack Query Composables & Nitro Server AI Routes

Status: done

## Mô tả
1. **Nitro Server Routes**:
   - `/api/astrolabe/calculate.post.ts`: Nhận payload ngày giờ sinh và tính lá số JSON tức thì.
   - `/api/ai/report.post.ts`: Gọi OpenAI-compatible LLM với structured context từ RAG để sinh bài luận giải tổng quan 5 mục (streaming text).
   - `/api/ai/chat.post.ts`: Nhận tin nhắn chat + ngữ cảnh lá số/cung đang xem, gọi LLM streaming trả lời tương tác.
2. **Client State & Persistence**:
   - Store `stores/useTuviStore.ts`: Quản lý lá số hiện tại, danh bạ lá số đã lưu và lịch sử chat (tự động đồng bộ LocalStorage qua `persist: true`).
3. **TanStack Query Composables**:
   - `useAstrolabeQuery`: Composable bọc TanStack Query cho việc fetch và cache kết quả phân tích.

## Tiêu chí hoàn thành (Acceptance Criteria)
- [x] Các API endpoint hoạt động ổn định với mock/live OpenAI-compatible LLM.
- [x] Pinia store tự động lưu và phục hồi dữ liệu từ LocalStorage khi reload trang.
- [x] TanStack Query tích hợp mượt mà, quản lý trạng thái loading/error chính xác.


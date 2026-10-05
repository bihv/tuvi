# Issue 01: Khởi tạo dự án Nuxt 3 & Cấu hình Hạ tầng Thư viện

Status: done

## Mô tả
Khởi tạo cấu trúc dự án Nuxt 3 với đầy đủ các thư viện và cấu hình theo kiến trúc đã thống nhất trong spec:
- Cài đặt `@nuxt/ui`, `@pinia/nuxt`, `@pinia-plugin-persistedstate/nuxt`, `@hebilicious/vue-query-nuxt`, `@tanstack/vue-query`, `iztro`.
- Cấu hình `nuxt.config.ts` để nạp các modules: `@nuxt/ui`, `@pinia/nuxt`, `@pinia-plugin-persistedstate/nuxt`, `@hebilicious/vue-query-nuxt`.
- Cấu hình file `.env.example` với `AI_BASE_URL`, `AI_API_KEY`, `AI_MODEL_NAME`.
- Thiết lập theme tối giản theo phong cách Apple Minimalist (hỗ trợ Dark Mode / Light Mode, font chữ sans-serif tinh tế).

## Tiêu chí hoàn thành (Acceptance Criteria)
- [x] Dự án Nuxt 3 chạy thành công môi trường dev.
- [x] Các module Pinia, TanStack Query, Nuxt UI hoạt động trơn tru không lỗi cấu hình.
- [x] File `.env.example` và `.env` mẫu được tạo đầy đủ.

# Nuxt 3 và In-Process Engine cho Tử Vi Web

Hệ thống cần lập lá số Tử Vi tức thì và cung cấp luận giải bằng AI theo phong cách giao diện tối giản Apple, giảm thiểu tối đa mã nguồn tự viết thủ công. Chúng tôi quyết định sử dụng **Nuxt 3** làm nền tảng full-stack duy nhất kết hợp thư viện tính toán an sao TypeScript in-process (`iztro`), thay vì tách riêng backend Python hoặc gọi API bên thứ ba. Lựa chọn này giúp ứng dụng có thể chạy hoàn toàn độc lập, tối ưu chi phí vận hành, đồng thời tận dụng hệ sinh thái Nuxt UI cho giao diện tinh tế và Vercel AI SDK cho luồng luận giải streaming.

import { createError, defineEventHandler, readBody } from 'h3'
import type { AiReportRequest } from '~/types/tuvi'
import { streamAiCompletion } from '~/server/utils/ai'
import { retrieveAstrologyContext } from '~/server/utils/rag'
import { getCanChiOfYear } from '~/utils/tuvi'

export default defineEventHandler(async (event) => {
  const body = await readBody<AiReportRequest>(event)

  if (!body || !body.astrolabe || !body.astrolabe.thienBan || !Array.isArray(body.astrolabe.palaces)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Vui lòng cung cấp dữ liệu lá số Tử Vi hợp lệ với đầy đủ 12 cung để sinh bài luận giải.',
    })
  }

  const { astrolabe } = body
  const ragResult = retrieveAstrologyContext(astrolabe)

  const viewingYear = astrolabe.thienBan.viewingYear || new Date().getFullYear()
  const canChiViewingYear = getCanChiOfYear(viewingYear)
  const birthYear = parseInt(astrolabe.thienBan.solarDate?.split('-')[0] || '2000', 10)
  const nominalAge = viewingYear - birthYear + 1

  const systemPrompt = `Bạn là Chuyên gia Cố Vấn Cuộc Sống & Luận Giải Tử Vi Đẩu Số cao cấp.
Bạn mang phong cách cố vấn Apple Minimalist: điềm tĩnh, ấm áp, khúc chiết, cấu trúc mạch lạc, thẩm mỹ cao và giàu tính nhân văn, thực tiễn.

NHIỆM VỤ CỦA BẠN:
Dựa trên Tri thức Tử Vi có cấu trúc được cung cấp, hãy viết bản Báo cáo Luận giải Tổng quan gồm ĐÚNG 5 PHẦN LỚN theo thứ tự chuẩn sau:

## 🌟 1. Tổng quan Bản Mệnh & Tính cách cốt lõi
- Luận giải vị trí Cung Mệnh, Thân, các Chính tinh và Phụ tinh đắc địa/hãm địa.
- Phân tích ưu thế bẩm sinh, điểm mù tâm lý và sứ mệnh cuộc đời.
> 💡 **Lời khuyên then chốt:** [Đúc kết 1 câu hành động thực tiễn đắt giá nhất cho bản mệnh]

## 💼 2. Sự nghiệp & Cơ hội phát triển (Cung Quan Lộc)
- Luận giải Cung Quan Lộc, các sao chủ quản sự nghiệp, cơ hội thăng tiến và môi trường làm việc phù hợp.
- Chỉ rõ phương pháp phát huy thế mạnh và khắc phục rủi ro công việc.
> 💡 **Chiến lược phát triển sự nghiệp:** [Hành động cụ thể]

## 💰 3. Tài lộc & Quản lý tài chính (Cung Tài Bạch)
- Luận giải Cung Tài Bạch, nguồn gốc dòng tiền (tích lũy hay đầu tư mạo hiểm, kinh doanh hay chuyên môn).
- Chiến lược giữ tiền và phân bổ vốn hiệu quả.
> 💡 **Lời khuyên tài chính:** [Nguyên tắc giữ tiền và đầu tư]

## ❤️ 4. Tình duyên & Gia đạo (Cung Phu Thê)
- Luận giải Cung Phu Thê, đặc điểm người phối ngẫu, tương quan tình cảm và cách hóa giải bất đồng.
> 💡 **Lời khuyên gia đạo:** [Bí quyết duy trì hòa khí và thấu hiểu]

## ⚡ 5. Xu hướng Vận hạn năm ${viewingYear} (${canChiViewingYear}, đương số ${nominalAge} tuổi mụ) & Lời khuyên hành động thực tế
### 🧭 5.1 Bối cảnh Lưu hạn tổng thể
- Phân tích vị trí Lưu Thái Tuế, Lưu Niên Mệnh, Lưu Quan Lộc, Lưu Tài Bạch, Lưu Phu Thê năm ${viewingYear}.
- Trình bày danh sách có gạch đầu dòng rõ ràng: \`- **[Tên sao/Lưu hạn]:** [Phân tích]\`

### 🔄 5.2 Tứ Hóa trong năm ${viewingYear} (${canChiViewingYear})
Lập bảng Markdown tổng hợp 4 Hóa tinh lưu niên:
| Hóa tinh | Cung vị | Tác động chính trong năm ${viewingYear} |
| :--- | :--- | :--- |
| **Lưu Hóa Lộc** ([Tên sao]) | [Cung vị] | [Tác động và cơ hội thuận lợi] |
| **Lưu Hóa Quyền** ([Tên sao]) | [Cung vị] | [Tác động và trách nhiệm/quyền hành] |
| **Lưu Hóa Khoa** ([Tên sao]) | [Cung vị] | [Tác động và danh tiếng/học hỏi] |
| **Lưu Hóa Kỵ** ([Tên sao]) | [Cung vị] | [Thách thức tiềm ẩn & giải pháp dự phòng] |

### 📅 5.3 Lịch trình đề xuất (theo tháng)
Lập bảng Markdown phân kỳ các giai đoạn trong năm ${viewingYear}:
| Giai đoạn | Trọng tâm | Hành động cụ thể |
| :--- | :--- | :--- |
| **Tháng 1-4** | [Trọng tâm] | [Hành động chiến lược] |
| **Tháng 5-8** | [Trọng tâm] | [Hành động chiến lược] |
| **Tháng 9-12** | [Trọng tâm] | [Hành động chiến lược] |

### 🎯 5.4 Kế hoạch hành động thực tế (kỳ hạn theo quý)
Trình bày danh sách hành động từng quý cụ thể cho năm ${viewingYear}:
1. **Quý 1 (${viewingYear})**
   - **Sức khỏe & Tinh thần:** [Hành động cụ thể]
   - **Tài chính & Sự nghiệp:** [Hành động cụ thể]
2. **Quý 2**
   - **Sự nghiệp & Mạng lưới:** [Hành động cụ thể]
3. **Quý 3**
   - **Đánh giá & Tối ưu:** [Hành động cụ thể]
4. **Quý 4**
   - **Thu hoạch & Chuẩn bị chu kỳ mới:** [Hành động cụ thể]

> 💡 **Thông điệp đúc kết năm ${viewingYear}:** [Một lời khuyên đắt giá truyền cảm hứng hành động]

NGUYÊN TẮC BẮT BUỘC:
- Mốc năm khảo sát vận hạn là **NĂM ${viewingYear} (${canChiViewingYear})**. Tuyệt đối không nhầm sang năm 2024 hay bất kỳ năm nào khác.
- Tuyệt đối không phán xét tiêu cực, không hù dọa, không mê tín dị đoan. Mọi diễn giải đều hướng tới sự tự chủ và giải pháp thực tế (Actionable Insights).
- BẮT BUỘC sử dụng đúng định dạng Markdown chuẩn:
  + Dùng tiêu đề \`##\` cho 5 phần lớn (kèm icon tương ứng).
  + Dùng tiêu đề \`###\` cho các tiểu mục (5.1, 5.2, 5.3, 5.4).
  + In đậm \`**...**\` tên sao, cung vị, thuật ngữ Tử Vi (ví dụ: **Lưu Thái Tuế**, **Lưu Hóa Lộc**, **Cung Quan Lộc**).
  + Dùng \`> 💡 **...**\` hoặc \`> ⚠️ **...**\` cho các khối trích dẫn lời khuyên.
  + Các bảng Markdown phải đủ cột, có hàng tiêu đề và vạch ngăn chuẩn.`

  const userPrompt = `Dưới đây là toàn bộ tri thức Tử Vi có cấu trúc của đương số ${astrolabe.thienBan.name}:

${ragResult.knowledgeMarkdown}

Xin hãy lập Báo cáo Luận giải chi tiết 5 mục cho tôi.`

  await streamAiCompletion(event, {
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.7,
  })
})

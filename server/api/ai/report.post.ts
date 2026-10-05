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
Bạn mang phong cách cố vấn Apple Minimalist: điềm tĩnh, ấm áp, khúc chiết, giàu tính nhân văn và thiết thực.

Nhiệm vụ của bạn:
Dựa trên Tri thức Tử Vi có cấu trúc được cung cấp, hãy viết một bản Báo cáo Luận giải Tổng quan gồm ĐÚNG 5 MỤC sau đây:
1. Tổng quan Bản Mệnh & Tính cách cốt lõi
2. Sự nghiệp & Cơ hội phát triển (Cung Quan Lộc)
3. Tài lộc & Quản lý tài chính (Cung Tài Bạch)
4. Tình duyên & Gia đạo (Cung Phu Thê)
5. Xu hướng Vận hạn năm ${viewingYear} (${canChiViewingYear}, đương số ${nominalAge} tuổi mụ) & Lời khuyên hành động thực tế

Nguyên tắc bắt buộc:
- Mốc năm khảo sát vận hạn là **NĂM ${viewingYear} (${canChiViewingYear})**. Mục 5 phải tập trung luận giải chi tiết xu hướng vận trình năm ${viewingYear} (công việc, tài lộc, tình duyên, biến động các tháng tới cuối năm); tuyệt đối không nhầm sang năm 2024 hay bất kỳ năm nào khác.
- Tuyệt đối không phán xét tiêu cực, không hù dọa, không mê tín dị đoan.
- Mỗi luận điểm đều phải gắn liền với thế đứng của các sao, cung vị và đưa ra lời khuyên hành động cụ thể (Actionable Advice).
- Trình bày định dạng Markdown tinh tế, sử dụng danh sách và tiêu đề rõ ràng.`

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

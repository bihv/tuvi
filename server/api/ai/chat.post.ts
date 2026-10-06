import { createError, defineEventHandler, readBody } from 'h3'
import type { AiChatRequest } from '~/types/tuvi'
import { streamAiCompletion } from '~/server/utils/ai'
import { retrieveAstrologyContext } from '~/server/utils/rag'
import { getCanChiOfYear } from '~/utils/tuvi'

export default defineEventHandler(async (event) => {
  const body = await readBody<AiChatRequest>(event)

  if (!body || !body.astrolabe || !body.messages || !Array.isArray(body.messages) || body.messages.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Vui lòng cung cấp lá số Tử Vi và nội dung tin nhắn trò chuyện.',
    })
  }

  const { astrolabe, targetPalaceName, messages } = body
  const ragResult = retrieveAstrologyContext(astrolabe, targetPalaceName)

  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth() + 1
  const currentDay = now.getDate()
  const currentDateStr = `${currentDay}/${currentMonth}/${currentYear}`

  const viewingYear = astrolabe.thienBan.viewingYear || currentYear
  const canChiViewingYear = getCanChiOfYear(viewingYear)
  const birthYear = parseInt(astrolabe.thienBan.solarDate?.split('-')[0] || '2000', 10)
  const nominalAge = viewingYear - birthYear + 1

  const palaceContextInstruction = targetPalaceName
    ? `Người dùng đang chọn xem chi tiết và hỏi về **Cung ${targetPalaceName}**. Hãy ưu tiên phân tích sâu bản chất của cung này, các chính tinh tọa thủ, phụ tinh, tam phương tứ chính hội chiếu, và tương quan với vận trình năm ${viewingYear} (${canChiViewingYear}).`
    : `Người dùng đang trò chuyện tự do về toàn thể lá số Tử Vi và vận trình năm ${viewingYear} (${canChiViewingYear}).`

  const systemPrompt = `Bạn là Trợ lý AI Cố Vấn Cuộc Sống Tử Vi Đẩu Số (Apple Minimalist AI Life Coach).
Đang trò chuyện với đương số: ${astrolabe.thienBan.name} (${astrolabe.thienBan.gender}, sinh ngày ${astrolabe.thienBan.solarDate}, bản mệnh ${astrolabe.thienBan.fiveElementsClass}).
${palaceContextInstruction}

QUY ĐỊNH BẮT BUỘC VỀ THỜI GIAN & MỐC NĂM ĐANG HỎI:
1. MỐC THỜI GIAN THỰC TẾ: Hôm nay là ngày ${currentDateStr} (Dương lịch năm ${currentYear}).
2. MỐC NĂM XEM HẠN CỦA LÁ SỐ: **NĂM ${viewingYear} (Năm Âm lịch ${canChiViewingYear})**, đương số ${nominalAge} tuổi mụ.
3. QUY TẮC HIỂU CÂU HỎI CỦA NGƯỜI DÙNG:
   - Khi đương số hỏi bằng các từ ngữ thời gian tương đối như: "năm nay", "cuối năm", "tới cuối năm", "thời gian tới", "sắp tới", "dạo này", "năm sau", "vận hạn hiện tại", "tháng tới"... bạn PHẢI LUÔN LUÔN HIỂU VÀ LUẬN GIẢI THEO **NĂM ${viewingYear} (${canChiViewingYear})**.
   - TUYỆT ĐỐI KHÔNG ĐƯỢC gán năm 2024 hay bất kỳ năm quá khứ nào khác là "năm nay" hay năm đang hỏi (trừ trường hợp duy nhất người dùng ghi rõ đích danh năm 2024 trong câu hỏi).
   - Trong câu trả lời, hãy luôn chỉ rõ mốc thời gian, ví dụ: "Xét trong năm ${viewingYear} (${canChiViewingYear}), đặc biệt từ nay đến giai đoạn cuối năm..." để người dùng an tâm và đối chiếu chính xác với lá số.
4. PHƯƠNG PHÁP LUẬN GIẢI VẬN TRÌNH THEO TỬ VI:
   - Kết hợp Cung gốc trên lá số + Cung Đại Vận hiện tại + Cung Lưu Niên của năm ${viewingYear} (${canChiViewingYear}) + Tác động của Lưu Thái Tuế, Lưu Tứ Hóa (Lộc, Quyền, Khoa, Kỵ) và các sao Lưu.
   - Khi hỏi về "công việc tới cuối năm": Phân tích Cung Quan Lộc gốc, Cung Lưu Quan Lộc năm ${viewingYear}, các sao Lưu Tứ Hóa và Lưu diệu tác động; chỉ rõ cơ hội, thách thức và lời khuyên hành động cụ thể từ nay đến cuối năm.
   - Khi hỏi về "tài chính tới cuối năm": Phân tích Cung Tài Bạch gốc và Lưu Tài Bạch năm ${viewingYear}.
   - Khi hỏi về "tình cảm": Phân tích Cung Phu Thê gốc và Lưu Phu Thê năm ${viewingYear}.

Phong cách giao tiếp & Định dạng Markdown chuẩn:
- Chuẩn mực Apple: Điềm đạm, ấm áp, khúc chiết, súc tích, tinh tế và giàu năng lượng tích cực.
- Không phán đoán tiêu cực hay hù dọa số phận. Mọi giải thích từ vị trí các sao đều phải hướng tới giải pháp và hành động thực tế (Actionable Insights).
- Phản hồi bằng tiếng Việt chuẩn mực, mạch lạc, dễ tiếp nhận.
- ĐỊNH DẠNG MARKDOWN TINH TẾ:
  + Dùng tiêu đề \`### [Icon] [Tiêu đề]\` khi chia ý lớn.
  + In đậm \`**...**\` tên sao, cung vị, thuật ngữ (ví dụ: **Cung Mệnh**, **Hóa Lộc**, **Tử Vi**).
  + Luôn sử dụng danh sách \`- **[Ý chính]:** [Nội dung]\` để câu trả lời thoáng mắt, dễ đọc.
  + Dùng \`> 💡 **Lời khuyên:** [Hành động]\` để tạo điểm nhấn giải pháp.
  + Dùng bảng Markdown khi so sánh các cung, các sao hoặc lịch trình thời gian.

TRI THỨC TỬ VI CỦA ĐƯƠNG SỐ ĐƯỢC CUNG CẤP:
${ragResult.knowledgeMarkdown}`

  const openAiMessages = [
    { role: 'system' as const, content: systemPrompt },
    ...messages.map(m => ({
      role: (m.role === 'user' ? 'user' : 'assistant') as 'user' | 'assistant',
      content: m.content,
    })),
  ]

  await streamAiCompletion(event, {
    messages: openAiMessages,
    temperature: 0.7,
  })
})

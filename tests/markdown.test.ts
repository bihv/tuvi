import { describe, expect, it } from 'vitest'
import { preprocessAiMarkdown, postprocessAiHtml, renderAiMarkdown } from '../utils/markdown'

describe('AI Markdown Formatter & Enhancer', () => {
  it('promotes unhashed top-level sections to H2 headings with icons', () => {
    const raw = `1. Tổng quan Bản Mệnh & Tính cách cốt lõi
5. Xu hướng Vận hạn năm 2026 (Bính Ngọ) & Lời khuyên hành động thực tế`

    const preprocessed = preprocessAiMarkdown(raw)
    expect(preprocessed).toContain('## 🌟 1. Tổng quan Bản Mệnh & Tính cách cốt lõi')
    expect(preprocessed).toContain('## ⚡ 5. Xu hướng Vận hạn năm 2026 (Bính Ngọ) & Lời khuyên hành động thực tế')
  })

  it('promotes unhashed subsections to H3 headings with icons', () => {
    const raw = `5.1 Bối cảnh Lưu hạn tổng thể
5.2 Tứ Hóa trong năm (Bính Ngọ)
5.3 Lịch trình đề xuất (theo tháng)
5.4 Kế hoạch hành động thực tế (kỳ hạn theo quý)`

    const preprocessed = preprocessAiMarkdown(raw)
    expect(preprocessed).toContain('### 🧭 5.1 Bối cảnh Lưu hạn tổng thể')
    expect(preprocessed).toContain('### 🔄 5.2 Tứ Hóa trong năm (Bính Ngọ)')
    expect(preprocessed).toContain('### 📅 5.3 Lịch trình đề xuất (theo tháng)')
    expect(preprocessed).toContain('### 🎯 5.4 Kế hoạch hành động thực tế (kỳ hạn theo quý)')
  })

  it('adds icons to existing ## and ### headers if missing', () => {
    const raw = `## 2. Sự nghiệp & Cơ hội phát triển (Cung Quan Lộc)
### 5.2 Tứ Hóa trong năm`

    const preprocessed = preprocessAiMarkdown(raw)
    expect(preprocessed).toContain('## 💼 2. Sự nghiệp & Cơ hội phát triển (Cung Quan Lộc)')
    expect(preprocessed).toContain('### 🔄 5.2 Tứ Hóa trong năm')
  })

  it('wraps markdown tables in responsive card containers', () => {
    const markdown = `
| Hóa tinh | Cung vị | Tác động chính trong năm 2026 |
| :--- | :--- | :--- |
| Lưu Hóa Lộc | Tật Ách | Sức khỏe dồi dào |
`
    const html = renderAiMarkdown(markdown)
    expect(html).toContain('class="ai-table-card"')
    expect(html).toContain('class="ai-table-scroll"')
    expect(html).toContain('class="ai-table"')
    expect(html).toContain('Hóa tinh</th>')
    expect(html).toContain('Tật Ách</td>')
  })

  it('transforms Tứ Hóa names into signature colored pill badges', () => {
    const markdown = `
- Lưu Hóa Lộc tại Cung Tật Ách
- Lưu Hóa Quyền tại Cung Huynh Đệ
- Lưu Hóa Khoa tại Cung Phúc Đức
- Lưu Hóa Kỵ tại Cung Quan Lộc
`
    const html = renderAiMarkdown(markdown)
    expect(html).toContain('class="tuvi-badge tuvi-badge-loc">Lưu Hóa Lộc</span>')
    expect(html).toContain('class="tuvi-badge tuvi-badge-quyen">Lưu Hóa Quyền</span>')
    expect(html).toContain('class="tuvi-badge tuvi-badge-khoa">Lưu Hóa Khoa</span>')
    expect(html).toContain('class="tuvi-badge tuvi-badge-ky">Lưu Hóa Kỵ</span>')
  })

  it('styles blockquotes with executive callout badges (tip, warning, info)', () => {
    const markdown = `
> 💡 **Lời khuyên then chốt:** Hãy rèn luyện thể thao hàng ngày.

> ⚠️ **Lưu ý phòng ngừa:** Cẩn trọng giấy tờ pháp lý.
`
    const html = renderAiMarkdown(markdown)
    expect(html).toContain('class="ai-callout ai-callout-tip"')
    expect(html).toContain('class="ai-callout ai-callout-warning"')
  })

  it('handles empty or malformed input gracefully without crashing', () => {
    expect(renderAiMarkdown('')).toBe('')
    expect(renderAiMarkdown('   ')).toBe('')
    expect(preprocessAiMarkdown('')).toBe('')
    expect(postprocessAiHtml('')).toBe('')
  })

  it('faithfully renders the real user case report from the screenshot', () => {
    const userScreenshotMarkdown = `
5. Xu hướng Vận hạn năm 2026 (Bính Ngọ) & Lời khuyên hành động thực tế
5.1 Bối cảnh Lưu hạn tổng thể
- Lưu Thái Tuế tại Phúc Đức - các vấn đề về tinh thần, sức khỏe và sự thỏa mãn trong cuộc sống sẽ có nhiều biến động.
- Lưu Niên Mệnh tại Phúc Đức - năng lượng tinh thần của bạn sẽ chi phối hiệu suất tổng thể; hãy chú ý đến sự cân bằng cảm xúc.

5.2 Tứ Hóa trong năm (Bính Ngọ)
| Hóa tinh | Cung vị | Tác động chính trong năm 2026 |
| :--- | :--- | :--- |
| Lưu Hóa Lộc (Đồng Âm) - Tật Ách | Nguồn năng lượng mới cho sức khỏe và sự phục hồi. |
| Lưu Hóa Quyền (Cơ Nguyệt) - Huynh Đệ | Bạn có nhiều trách nhiệm lãnh đạo trong gia đình. |
| Lưu Hóa Khoa (Văn Xương) - Phúc Đức | Danh tiếng được nâng cao qua học tập. |
| Lưu Hóa Kỵ (Liêm Trinh) - Quan Lộc | Các trở ngại tiềm ẩn - thủ tục giấy tờ. |

5.3 Lịch trình đề xuất (theo tháng)
| Giai đoạn | Trọng tâm | Hành động cụ thể |
| :--- | :--- | :--- |
| Tháng 1-4 | Xây dựng nền tảng | Khám sức khỏe tổng quát. |
| Tháng 5-8 | Phát triển danh tiếng | Chia sẻ các nghiên cứu chuyên sâu. |

5.4 Kế hoạch hành động thực tế (kỳ hạn theo quý)
1. Quý 1 (2026)
   - Sức khỏe & Tinh thần: Đặt lịch khám sức khỏe định kỳ.
   - Tài chính: Ký một thỏa thuận hợp tác.
`
    const html = renderAiMarkdown(userScreenshotMarkdown)
    expect(html).toContain('<h2>')
    expect(html).toContain('<h3>')
    expect(html).toContain('ai-table-card')
    expect(html).toContain('tuvi-badge-loc')
    expect(html).toContain('tuvi-badge-quyen')
    expect(html).toContain('tuvi-badge-khoa')
    expect(html).toContain('tuvi-badge-ky')
  })
})

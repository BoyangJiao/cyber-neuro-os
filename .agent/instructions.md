# AI Agent Instructions

- **Response Language**: All responses to the user MUST be in Chinese (简体中文).
- **Style**: Maintain a helpful, technical, and professional tone aligned with the Cyber Neuro OS project aesthetic.
- **Design Baseline**: **All dimensions and design references provided by the user are based on a 1440px viewport width (standard laptop/desktop).** When implementing responsive styles, target the standard desktop breakpoint (usually `xl` in Tailwind) for these specific values.

## 协作准则 (Collaboration Guidelines)

### 1. 精准执行模式 (Precision Execution)
当用户发出 **明确且精准** 的修改指令，或者明确要求 **“不要自由发挥”** 时：
- **核心原则**：严格遵照指令边界，严禁任何超出指令范围的创意改动。
- **行为建议**：精准实现逻辑需求，不添加任何未提及的装饰或功能增强。

### 2. 创意工程师模式 (Creative Engineering)
当用户的需求比较 **模糊/宽泛**，或者没有明确禁止自由发挥时：
- **核心原则**：你可以作为“创意工程师”，根据赛博朋克美学和专业 UI 理解进行自由发挥。
- **行为建议**：
    - 优化视觉动效和微交互。
    - 在保证功能实现的基础上，提升整体 UI 的精致度和视觉冲击力。
### 3. Arwes 官方组件优先原则 (Official Arwes Priority)
- **核心原则**：除非明确要求自定义或针对 `CyberButton` 等需要极致细腻效果的组件，否则应直接引用 `@arwes/react` 提供官方组件。
- **动效考量**：直接引用官方组件是为了后续能更好地集成 Arwes 的动画系统。
- **解耦声明**：`CyberButton` 目前保持相对独立和自定义，而其他框架类元素（如 `HoloFrame` 等）应优先使用官方原生实现。

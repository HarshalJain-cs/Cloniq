/**
 * UI/UX Designer Agent - WORKING WITH VISUAL PREVIEWS
 * Generates component designs with live HTML/CSS/React previews
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const DesignRequestSchema = z.object({
  component: z.string(), // button, card, form, navbar, etc.
  style: z.enum(["modern", "glassmorphism", "neumorphism", "minimalist", "brutalist"]).default("modern"),
  colors: z.object({
    primary: z.string().default("#3b82f6"),
    secondary: z.string().default("#8b5cf6"),
    background: z.string().default("#ffffff"),
  }).optional(),
  preview: z.boolean().default(true),
});

// Component templates
const COMPONENT_TEMPLATES = {
  button: (style: string, colors: any) => {
    const styles = {
      modern: `
        background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%);
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        border: none;
        font-weight: 600;
        cursor: pointer;
        transition: transform 0.2s, box-shadow 0.2s;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      `,
      glassmorphism: `
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: ${colors.primary};
        padding: 12px 24px;
        border-radius: 12px;
        font-weight: 600;
        cursor: pointer;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      `,
      neumorphism: `
        background: ${colors.background};
        color: ${colors.primary};
        padding: 12px 24px;
        border-radius: 12px;
        border: none;
        font-weight: 600;
        cursor: pointer;
        box-shadow: 6px 6px 12px rgba(0, 0, 0, 0.1), -6px -6px 12px rgba(255, 255, 255, 0.7);
      `,
      minimalist: `
        background: ${colors.primary};
        color: white;
        padding: 10px 20px;
        border-radius: 4px;
        border: none;
        font-weight: 500;
        cursor: pointer;
      `,
      brutalist: `
        background: ${colors.primary};
        color: black;
        padding: 12px 24px;
        border: 4px solid black;
        font-weight: 900;
        cursor: pointer;
        text-transform: uppercase;
        box-shadow: 8px 8px 0 black;
      `,
    };

    return {
      html: `<button class="component-button">Click Me</button>`,
      css: `.component-button { ${styles[style as keyof typeof styles]} }
.component-button:hover { transform: translateY(-2px); }`,
      react: `
export function Button() {
  return (
    <button
      className="component-button"
      onClick={() => alert('Clicked!')}
    >
      Click Me
    </button>
  );
}`,
    };
  },

  card: (style: string, colors: any) => ({
    html: `
<div class="component-card">
  <h3>Card Title</h3>
  <p>This is a beautifully designed card component with ${style} styling.</p>
  <button>Learn More</button>
</div>`,
    css: `
.component-card {
  background: ${style === "glassmorphism" ? "rgba(255, 255, 255, 0.1)" : colors.background};
  ${style === "glassmorphism" ? "backdrop-filter: blur(10px);" : ""}
  padding: 24px;
  border-radius: ${style === "brutalist" ? "0" : "16px"};
  ${style === "brutalist" ? "border: 4px solid black;" : "border: 1px solid rgba(0, 0, 0, 0.1);"}
  box-shadow: ${style === "neumorphism" ? "8px 8px 16px rgba(0, 0, 0, 0.1), -8px -8px 16px rgba(255, 255, 255, 0.7)" : "0 4px 6px rgba(0, 0, 0, 0.1)"};
}
.component-card h3 { color: ${colors.primary}; margin-top: 0; }
.component-card button {
  background: ${colors.primary};
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: ${style === "brutalist" ? "0" : "8px"};
  margin-top: 12px;
  cursor: pointer;
}`,
    react: `
export function Card() {
  return (
    <div className="component-card">
      <h3>Card Title</h3>
      <p>This is a beautifully designed card component with ${style} styling.</p>
      <button onClick={() => alert('Action clicked!')}>Learn More</button>
    </div>
  );
}`,
  }),

  form: (style: string, colors: any) => ({
    html: `
<form class="component-form">
  <label>Email Address</label>
  <input type="email" placeholder="you@example.com" />
  <label>Password</label>
  <input type="password" placeholder="••••••••" />
  <button type="submit">Sign In</button>
</form>`,
    css: `
.component-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 400px;
}
.component-form label { color: ${colors.primary}; font-weight: 600; }
.component-form input {
  padding: 12px;
  border-radius: ${style === "brutalist" ? "0" : "8px"};
  border: 2px solid ${colors.primary};
  font-size: 16px;
}
.component-form button {
  background: ${colors.primary};
  color: white;
  padding: 12px;
  border: none;
  border-radius: ${style === "brutalist" ? "0" : "8px"};
  font-weight: 600;
  cursor: pointer;
}`,
    react: `
export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <form className="component-form" onSubmit={(e) => { e.preventDefault(); alert('Form submitted!'); }}>
      <label>Email Address</label>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
      <label>Password</label>
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
      <button type="submit">Sign In</button>
    </form>
  );
}`,
  }),
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { component, style, colors, preview } = DesignRequestSchema.parse(body);

    const defaultColors = colors || {
      primary: "#3b82f6",
      secondary: "#8b5cf6",
      background: "#ffffff",
    };

    // Generate component code
    const template = COMPONENT_TEMPLATES[component as keyof typeof COMPONENT_TEMPLATES];
    if (!template) {
      return NextResponse.json(
        { error: `Component type "${component}" not supported. Try: button, card, form` },
        { status: 400 }
      );
    }

    const generated = template(style, defaultColors);

    // Generate live preview HTML
    const previewHTML = preview ? `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      padding: 40px;
      background: ${style === "glassmorphism" ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" : "#f5f5f5"};
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
    }
    ${generated.css}
  </style>
</head>
<body>
  ${generated.html}
</body>
</html>` : null;

    return NextResponse.json({
      success: true,
      design: {
        component,
        style,
        colors: defaultColors,
        code: {
          html: generated.html,
          css: generated.css,
          react: generated.react,
        },
        preview: {
          html: previewHTML,
          // Base64 encode for easy embedding
          dataUrl: previewHTML ? `data:text/html;base64,${Buffer.from(previewHTML).toString("base64")}` : null,
        },
      },
      message: `Generated ${component} component with ${style} styling. Use the preview.dataUrl in an iframe or open preview.html directly.`,
    });
  } catch (error: any) {
    console.error("UI/UX Designer error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate design" },
      { status: 500 }
    );
  }
}

// Get component catalog
export async function GET() {
  return NextResponse.json({
    agent: "ui-ux-designer",
    status: "active",
    capabilities: {
      components: ["button", "card", "form"],
      styles: ["modern", "glassmorphism", "neumorphism", "minimalist", "brutalist"],
      features: ["HTML/CSS generation", "React component generation", "Live preview"],
    },
    info: "This agent generates UI components with live previews. POST with {component, style, colors} to generate designs.",
    example: {
      request: {
        component: "button",
        style: "glassmorphism",
        colors: { primary: "#3b82f6", secondary: "#8b5cf6", background: "#ffffff" },
      },
    },
  });
}

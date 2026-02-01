import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Max-Age": "86400",
};

interface FoodAnalysisRequest {
  image: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders
    });
  }

  try {
    const { image }: FoodAnalysisRequest = await req.json();

    if (!image) {
      return new Response(
        JSON.stringify({ error: "请上传食物图片" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log("Analyzing food image...");

    const prompt = `你是一个专业的营养师和食物识别专家。请分析这张食物图片，识别其中的所有食物，并估算其营养成分。

请以以下 JSON 格式返回结果（只返回 JSON，不要其他文字）：
{
  "totalCalories": 总卡路里数（整数）,
  "protein": 蛋白质克数（整数）,
  "carbs": 碳水化合物克数（整数）,
  "fat": 脂肪克数（整数）,
  "fiber": 膳食纤维克数（整数）,
  "foods": [
    {
      "name": "食物名称",
      "portion": "估算份量（如：约100g）",
      "calories": 该食物卡路里（整数）,
      "confidence": 识别置信度（0-1之间的小数）
    }
  ]
}

注意：
1. 请尽可能准确地识别图片中的所有食物
2. 卡路里和营养成分应该是合理的估算值
3. 置信度根据图片清晰度和食物可识别程度来评估
4. 如果图片中没有食物，返回空的 foods 数组和 0 值`;

    const response = await fetch("https://www.needware.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              { type: "image_url", image_url: { url: image } }
            ]
          }
        ],
        temperature: 0.3,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI service error:", response.status, errorText);
      throw new Error(`分析失败: ${errorText}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("AI 未返回分析结果");
    }

    // Parse JSON from response
    let nutritionData;
    try {
      const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/) || content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const jsonStr = jsonMatch[1] || jsonMatch[0];
        nutritionData = JSON.parse(jsonStr);
      } else {
        throw new Error("无法解析 AI 响应");
      }
    } catch (parseError) {
      console.error("JSON parse error:", parseError, "Content:", content);
      throw new Error("分析结果格式错误");
    }

    console.log("Food analysis completed:", nutritionData);

    return new Response(
      JSON.stringify({
        success: true,
        data: nutritionData
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );

  } catch (error: any) {
    console.error("Food analysis error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "分析失败，请重试" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);

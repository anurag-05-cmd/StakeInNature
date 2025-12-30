import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";
import { ethers } from "ethers";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ADMIN_PRIVATE_KEY = process.env.ADMIN_PRIVATE_KEY;
const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || "https://rpc.awakening.bdagscan.com";
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

console.log("GEMINI_API_KEY:", GEMINI_API_KEY);
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("image") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No image provided" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");

    // Determine media type
    const mimeType = file.type || "image/jpeg";

    const prompt = `You are an EXTREMELY STRICT expert validator for social and environmental work. Your job is to verify that an image shows ACTUAL PEOPLE performing GENUINE SOCIAL OR ENVIRONMENTAL WORK.

REJECTION CRITERIA (Set confidence to 0-20 if ANY of these apply):
- Image contains NO PEOPLE or only shows animals/pets/nature without human action
- Image shows people but they are NOT actively working (just posing, smiling at camera, sitting)
- Image is of a historical figure, celebrity, or person without context of work
- Image is clearly AI-generated, meme, artistic, or historical
- Image shows people in casual settings without evidence of actual work
- No visible tools, materials, or evidence of productive labor
- Image is too blurry, low quality, or unclear to assess
- Image shows staged, minimal, or symbolic work without genuine effort
- Image depicts leisure, social gatherings, or non-work activities
- Image showing watermarks, logos, or text overlays that obscure content
- Image appears to be a screenshot, collage, or heavily edited
- Image showing watermark of any ai generaion software
- Image containing celebrities needs to go through thorough checking
- Immediate rejection on deepfake images

ACCEPTABLE CRITERIA (Set confidence to 70-100 if ALL of these apply):
- CLEARLY shows 1+ people actively engaged in visible work
- Visible evidence of labor: holding tools, materials, equipment, trash bags, plants, etc.
- Context clearly indicates genuine work: environmental cleanup, recycling, planting, construction, community service, waste management, repair work
- People appear genuinely engaged in the task, not just posing
- Work appears substantial and productive, not minimal or staged

MODERATE CRITERIA (Set confidence to 40-70):
- Shows people and some work evidence but context is ambiguous
- Quality or effort appears moderate
- Could be genuine but needs more evidence

Respond ONLY with valid JSON:
{
  "isGoodImage": true or false,
  "confidence": number between 0 and 100,
  "reason": "Specific reason with details about what you see (or don't see)"
}

Be RUTHLESSLY STRICT. Most images should fail (confidence < 50). Only accept images where you can clearly see people actively working with visible evidence of effort.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                mimeType: mimeType,
                data: base64,
              },
            },
            {
              text: prompt,
            },
          ],
        },
      ],
    });

    const responseText = response.text || "";

    // Extract JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json(
        { error: "Failed to parse Gemini response" },
        { status: 500 }
      );
    }

    const result = JSON.parse(jsonMatch[0]);

    // Determine success based on confidence > 50%
    const success = result.confidence > 50;
    console.log({result})

    // Get user address from form data
    const userAddress = formData.get("userAddress") as string;
    
    if (!userAddress) {
      return NextResponse.json(
        { error: "User address is required" },
        { status: 400 }
      );
    }

    // Call contract function based on confidence score
    try {
      if (!ADMIN_PRIVATE_KEY || !CONTRACT_ADDRESS) {
        throw new Error("Admin credentials not configured");
      }

      const provider = new ethers.JsonRpcProvider(RPC_URL);
      const adminWallet = new ethers.Wallet(ADMIN_PRIVATE_KEY, provider);
      
      // Import contract ABI functions
      const CONTRACT_ABI = [
        "function slashUser(address user) external",
        "function validateUser(address user) external",
      ];
      
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, adminWallet);

      if (result.confidence < 50) {
        // Slash user for low confidence
        console.log(`Slashing user ${userAddress} (confidence: ${result.confidence}%)`);
        const tx = await contract.slashUser(userAddress);
        await tx.wait();
        console.log(`User ${userAddress} slashed successfully`);
      } else {
        // Validate user for high confidence
        console.log(`Validating user ${userAddress} (confidence: ${result.confidence}%)`);
        const tx = await contract.validateUser(userAddress);
        await tx.wait();
        console.log(`User ${userAddress} validated successfully with 8% reward`);
      }
    } catch (contractError: any) {
      console.error("Contract interaction error:", contractError);
      // Don't fail the response if contract call fails, just log it
      // The UI will still show the validation result
    }

    return NextResponse.json({
      success,
      confidence: result.confidence,
      isGoodImage: result.isGoodImage,
      reason: result.reason,
    });
  } catch (error) {
    console.error("Validation error:", error);
    return NextResponse.json(
      { error: "Failed to validate image" },
      { status: 500 }
    );
  }
}

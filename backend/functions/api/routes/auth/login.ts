import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import jwt from 'jsonwebtoken';

// Validation schema
const LoginRequestSchema = z.object({
  email: z.string().email('Valid email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

// Types
interface User {
  id: string;
  email: string;
  name: string;
  subscription: {
    plan: 'free' | 'pro' | 'team';
    status: 'active' | 'canceled' | 'past_due';
    currentPeriodEnd: Date;
  };
  usage: {
    prdsCreated: number;
    projectsGenerated: number;
    apiCalls: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

interface JWTPayload {
  userId: string;
  email: string;
  plan: string;
  iat: number;
  exp: number;
}

// Login endpoint
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = LoginRequestSchema.parse(body);

    // TODO: Implement actual authentication logic
    // This would involve:
    // 1. Checking credentials against database
    // 2. Verifying password hash
    // 3. Generating JWT token
    // 4. Returning user data

    // Mock authentication for now
    const mockUser: User = {
      id: 'user_123',
      email: validatedData.email,
      name: 'John Doe',
      subscription: {
        plan: 'pro',
        status: 'active',
        currentPeriodEnd: new Date('2024-12-31T23:59:59Z')
      },
      usage: {
        prdsCreated: 5,
        projectsGenerated: 3,
        apiCalls: 150
      },
      createdAt: new Date('2024-01-01T00:00:00Z'),
      updatedAt: new Date()
    };

    // Generate JWT token
    const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
    const tokenPayload: JWTPayload = {
      userId: mockUser.id,
      email: mockUser.email,
      plan: mockUser.subscription.plan,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
    };

    const token = jwt.sign(tokenPayload, jwtSecret);

    return NextResponse.json({
      user: mockUser,
      token,
      success: true
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'INVALID_INPUT',
          message: 'Invalid request data',
          details: error.errors
        },
        timestamp: new Date()
      }, { status: 400 });
    }

    console.error('Error during login:', error);
    return NextResponse.json({
      success: false,
      error: {
        code: 'API_ERROR',
        message: 'Internal server error'
      },
      timestamp: new Date()
    }, { status: 500 });
  }
} 
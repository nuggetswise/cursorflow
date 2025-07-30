import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Validation schema
const RegisterRequestSchema = z.object({
  email: z.string().email('Valid email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(1, 'Name is required')
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

// Register endpoint
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = RegisterRequestSchema.parse(body);

    // TODO: Implement actual registration logic
    // This would involve:
    // 1. Checking if user already exists
    // 2. Hashing password
    // 3. Creating user in database
    // 4. Generating JWT token
    // 5. Returning user data

    // Mock registration for now
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);
    
    const mockUser: User = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      email: validatedData.email,
      name: validatedData.name,
      subscription: {
        plan: 'free',
        status: 'active',
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
      },
      usage: {
        prdsCreated: 0,
        projectsGenerated: 0,
        apiCalls: 0
      },
      createdAt: new Date(),
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
    }, { status: 201 });

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

    console.error('Error during registration:', error);
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
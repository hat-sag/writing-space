import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("writing-app");  // Changed to match connection string
    
    const documents = await db.collection("writings")
      .find({})
      .sort({ updatedAt: -1 })
      .limit(1)
      .toArray();
    
    console.log('Found documents:', documents);
    return NextResponse.json(documents[0] || { content: '' });
  } catch (error) {
    console.error('Database GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch content' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    console.log('API: Starting POST request');
    const client = await clientPromise;
    console.log('API: MongoDB connected');
    
    const db = client.db("writing-app");  // Changed to match connection string
    console.log('API: Got database reference');
    
    const { content } = await request.json();
    console.log('API: Content received:', content);
    
    // Create a new document
    const document = {
      content,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Insert the document
    const result = await db.collection("writings").insertOne(document);
    console.log('API: Document inserted:', result);
    
    if (!result.acknowledged) {
      throw new Error('Failed to insert document');
    }
    
    return NextResponse.json({ 
      success: true, 
      id: result.insertedId.toString(),
      document
    });
  } catch (error) {
    console.error('API: Database POST error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to save content' },
      { status: 500 }
    );
  }
}
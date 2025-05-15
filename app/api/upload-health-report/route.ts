import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    // Get the form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const userId = formData.get('userId') as string;
    
    if (!file || !userId) {
      return NextResponse.json(
        { message: 'File and userId are required' },
        { status: 400 }
      );
    }

    // Create server-side Supabase client with admin privileges
    const supabase = createServerSupabaseClient();
    
    // Convert file to buffer
    const buffer = await file.arrayBuffer();
    
    // Upload to Supabase Storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${Date.now()}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('health-reports')
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: true,
      });
      
    if (error) {
      console.error('Server upload error:', error);
      return NextResponse.json(
        { message: error.message },
        { status: 500 }
      );
    }
    
    // Get public URL
    const { data: urlData } = supabase.storage
      .from('health-reports')
      .getPublicUrl(data.path);
      
    return NextResponse.json({ url: urlData.publicUrl });
    
  } catch (error: any) {
    console.error('Unexpected server error:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
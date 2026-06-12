import { connectDB } from '@/lib/mongodb';
import { Notification } from '@/models/Notification';
import { NextRequest, NextResponse } from 'next/server';

// GET all notifications
export async function GET() {
  try {
    await connectDB();
    const notifications = await Notification.find({}).sort({ createdAt: 1 });
    return NextResponse.json(notifications);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Error fetching notifications' },
      { status: 500 }
    );
  }
}

// POST create a new notification
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const data = await request.json();

    if (!data.text || !data.text.trim()) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    const notification = await Notification.create({ text: data.text.trim() });
    return NextResponse.json(notification, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Error creating notification' },
      { status: 400 }
    );
  }
}

// DELETE a notification by ID
export async function DELETE(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Notification ID is required' }, { status: 400 });
    }

    const notification = await Notification.findByIdAndDelete(id);
    if (!notification) {
      return NextResponse.json({ error: 'Notification not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Notification deleted successfully' });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Error deleting notification' },
      { status: 400 }
    );
  }
}

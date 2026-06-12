import { connectDB } from '@/lib/mongodb';
import { Job, IJob } from '@/models/Job';
import { NextRequest, NextResponse } from 'next/server';

// GET all jobs or specific job
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const job = await Job.findById(id);
      if (!job) {
        return NextResponse.json({ error: 'Job not found' }, { status: 404 });
      }
      return NextResponse.json(job);
    }

    const jobs = await Job.find({}).sort({ deadline: 1 });
    return NextResponse.json(jobs);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Error fetching jobs' },
      { status: 500 }
    );
  }
}

// POST create new job
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const data: IJob = await request.json();

    const job = await Job.create(data);
    return NextResponse.json(job, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Error creating job' },
      { status: 400 }
    );
  }
}

// PUT update job
export async function PUT(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Job ID is required' }, { status: 400 });
    }

    const data: IJob = await request.json();

    const job = await Job.findByIdAndUpdate(id, data, { new: true });
    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    return NextResponse.json(job);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Error updating job' },
      { status: 400 }
    );
  }
}

// DELETE job
export async function DELETE(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Job ID is required' }, { status: 400 });
    }

    const job = await Job.findByIdAndDelete(id);
    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Job deleted successfully' });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Error deleting job' },
      { status: 400 }
    );
  }
}

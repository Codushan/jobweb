# Engineer Job Portal - Setup Guide

A beautiful, aesthetic job portal for engineers to find and apply to job openings. Built with Next.js, MongoDB, and styled to match government job portals.

## Features

✅ **Public Job Listings**
- Browse job openings from multiple companies
- Filter by job type (GATE, Non-GATE, Mixed)
- Filter by engineering branches (CSE, ECE, ME, CIVIL, etc.)
- Filter by eligibility (Non-engineers welcome)
- Sort by newest, deadline, or salary
- View detailed job information in modal popups
- Direct apply button with external links

✅ **Admin Panel** (URL: `/jobinjobadmincb`)
- Simple 3-field authentication (username, password, relation)
- Add, edit, and delete job postings
- Full CRUD operations for job management
- Search jobs by title or organization

✅ **Design**
- Government aesthetic matching scholarships.gov.in
- Navy blue primary color (#1a3a6b)
- Saffron accent color (#e07b00)
- Green secondary color (#1a7a3c)
- Responsive design (mobile, tablet, desktop)
- Sticky header with job opening ticker
- Professional typography (Baloo 2 + Hind fonts)

## Setup Instructions

### Step 1: Get MongoDB Connection String

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account (no credit card required)
3. Create a new cluster (free tier available)
4. Click "Connect" and copy the connection string
5. Replace `<username>` and `<password>` with your credentials
6. Add database name: `engineerjobs`

Your connection string should look like:
```
mongodb+srv://username:password@clustername.mongodb.net/engineerjobs?retryWrites=true&w=majority
```

### Step 2: Set Environment Variables

1. Create a `.env.local` file in the project root
2. Add your MongoDB connection string:
```
MONGODB_URI=mongodb+srv://username:password@clustername.mongodb.net/engineerjobs?retryWrites=true&w=majority
```

### Step 3: Install Dependencies

```bash
pnpm install
```

### Step 4: Seed Sample Data (Optional)

To populate the database with sample job listings:

```bash
node scripts/seed.js
```

This adds 5 sample jobs from companies like Google, Microsoft, Bosch, Intel, and L&T.

### Step 5: Run Development Server

```bash
pnpm dev
```

The app will be available at `http://localhost:3000`

## Admin Panel Access

**URL:** `http://localhost:3000/jobinjobadmincb`

**Credentials:**
- Username: `ramisrich`
- Password: `&wokahaTick`
- Relation: `tera mummy ka bhatar`

Once logged in, you can:
- View all job postings in a table
- Search jobs by title or company
- Edit existing jobs
- Delete job postings
- Create new job postings with full details

## API Endpoints

All API operations use `/api/jobs` endpoint:

### Get All Jobs
```
GET /api/jobs
```

### Get Specific Job
```
GET /api/jobs?id=<jobId>
```

### Create Job
```
POST /api/jobs
Content-Type: application/json

{
  "title": "Software Engineer",
  "organization": "Company Name",
  "jobType": "GATE",
  "eligibleBranches": ["CSE", "ECE"],
  "openToNonEngineering": false,
  "numberOfPositions": 50,
  "salary": "₹ 60,00,000 LPA",
  "ageLimit": "21-28 years",
  "eligibility": ["Minimum 6 CGPA", "GATE qualified"],
  "eligibilityFinalYear": false,
  "applicationUrl": "https://...",
  "deadline": "2024-12-31T00:00:00Z",
  "status": "OPEN",
  "description": "Job description..."
}
```

### Update Job
```
PUT /api/jobs?id=<jobId>
Content-Type: application/json
[same payload as POST]
```

### Delete Job
```
DELETE /api/jobs?id=<jobId>
```

## Project Structure

```
.
├── app/
│   ├── page.tsx                    # Public home page
│   ├── layout.tsx                  # Root layout with fonts
│   ├── globals.css                 # Theme & styling
│   ├── jobinjobadmincb/
│   │   └── page.tsx               # Admin panel page
│   └── api/jobs/
│       └── route.ts               # API endpoints
├── components/
│   ├── Header.tsx                 # Top header with ticker
│   ├── HeroSection.tsx            # Hero banner
│   ├── FilterSection.tsx          # Filters & sorting
│   ├── JobCard.tsx                # Job listing card
│   ├── JobDetailModal.tsx         # Job details popup
│   ├── AdminAuthPage.tsx          # Admin login
│   ├── AdminPanel.tsx             # Admin dashboard
│   └── AdminJobForm.tsx           # Job edit/create form
├── models/
│   └── Job.ts                     # MongoDB Job model
├── lib/
│   └── mongodb.ts                 # MongoDB connection
├── scripts/
│   └── seed.js                    # Sample data seeding
└── .env.local                     # MongoDB URI (create this)
```

## Job Data Schema

Each job requires:

| Field | Type | Required | Example |
|-------|------|----------|---------|
| title | string | ✓ | "Software Engineer" |
| organization | string | ✓ | "Google India" |
| jobType | GATE/NON_GATE/MIXED | ✓ | "GATE" |
| eligibleBranches | string[] | ✓ | ["CSE", "IT"] |
| openToNonEngineering | boolean | ✓ | false |
| numberOfPositions | number | ✓ | 50 |
| salary | string | ✓ | "₹ 60,00,000 LPA" |
| ageLimit | string | ✓ | "21-28 years" |
| eligibility | string[] | ✓ | ["6 CGPA", "No backlogs"] |
| eligibilityFinalYear | boolean | ✓ | false |
| applicationUrl | string | ✓ | "https://..." |
| deadline | Date | ✓ | 2024-12-31 |
| status | OPEN/CLOSING_SOON/CLOSED/EXAM_PHASE | ✓ | "OPEN" |
| description | string | ✓ | "Job details..." |

## Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variable: `MONGODB_URI`
4. Deploy!

### Deploy to Other Platforms

Make sure to:
1. Set `MONGODB_URI` environment variable
2. Install dependencies
3. Run `pnpm build`
4. Start with `pnpm start`

## Technology Stack

- **Frontend**: Next.js 16, React 19, Tailwind CSS 4
- **Database**: MongoDB Atlas (free tier)
- **ORM**: Mongoose
- **Styling**: Custom CSS + Tailwind
- **Fonts**: Baloo 2 (headings) + Hind (body)
- **Colors**: Navy, Saffron, Green (government aesthetic)

## Troubleshooting

### "Failed to fetch jobs" error
- Check if MongoDB URI is correctly set in `.env.local`
- Verify MongoDB connection string credentials
- Make sure the database cluster is active in MongoDB Atlas

### Admin login not working
- Credentials are case-sensitive
- Username: `ramisrich`
- Password: `&wokahaTick` (note the ampersand)
- Relation: `tera mummy ka bhatar`

### Jobs not appearing after seeding
- Run `node scripts/seed.js` again
- Check MongoDB Atlas to confirm data was inserted
- Reload the page in browser

## Features Coming Soon

- Real-time notifications for new job postings
- Email alerts for saved jobs
- User accounts and job preferences
- Download resume functionality
- Job application tracking

## License

Free to use and modify for personal or commercial projects.

## Support

For issues or questions, refer to the code comments or contact the developer.

---

**Happy job hunting! 🚀**

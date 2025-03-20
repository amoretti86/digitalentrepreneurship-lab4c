# Campus Closet - Clothing Rental Marketplace

Campus Closet is a web application that enables college students to rent clothing items from each other. This application includes user authentication, listing management, and payment processing with Square.

## Features

- User authentication with email verification
- Create, view, and search clothing listings
- Rental date selection and availability management
- Secure payment processing via Square
- Responsive UI for both desktop and mobile

## Tech Stack

- **Frontend**: React.js with custom CSS
- **Backend**: Node.js with Express
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **File Storage**: Supabase Storage
- **Payment Processing**: Square API

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Supabase account
- Square Developer account

### Environment Variables

Create a `.env` file in the server directory with the following variables:

```
# Supabase Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Square API Credentials (for payment processing)
SQUARE_ACCESS_TOKEN=your_square_sandbox_access_token

# Server Configuration
PORT=5000
NODE_ENV=development
```

### Database Setup

1. Create a new Supabase project
2. Execute the following SQL commands in the Supabase SQL Editor to set up the necessary tables:

```sql
-- Create listings table
CREATE TABLE IF NOT EXISTS public.listings (
  id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  user uuid REFERENCES auth.users(id) NOT NULL,
  title text NOT NULL,
  size text NOT NULL,
  itemType text NOT NULL,
  condition text NOT NULL,
  washInstructions text NOT NULL,
  startDate timestamp with time zone NOT NULL,
  endDate timestamp with time zone NOT NULL,
  pricePerDay numeric(10,2) NOT NULL,
  imageURL text,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Create rentals table for tracking rented items
CREATE TABLE IF NOT EXISTS public.rentals (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  listing_id bigint REFERENCES public.listings(id) NOT NULL,
  renter_id uuid REFERENCES auth.users(id) NOT NULL,
  start_date timestamp with time zone NOT NULL,
  end_date timestamp with time zone NOT NULL,
  total_amount numeric(10,2) NOT NULL,
  payment_id text NOT NULL,
  status text NOT NULL DEFAULT 'pending', -- pending, confirmed, canceled, completed
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Set up Row Level Security (RLS) policies
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rentals ENABLE ROW LEVEL SECURITY;

-- Allow users to view all listings
CREATE POLICY "Anyone can view listings" 
ON public.listings 
FOR SELECT 
USING (true);

-- Allow users to insert their own listings
CREATE POLICY "Users can insert their own listings" 
ON public.listings 
FOR INSERT 
WITH CHECK (auth.uid() = user);

-- Allow users to update their own listings
CREATE POLICY "Users can update their own listings" 
ON public.listings 
FOR UPDATE 
USING (auth.uid() = user);

-- Allow users to delete their own listings
CREATE POLICY "Users can delete their own listings" 
ON public.listings 
FOR DELETE 
USING (auth.uid() = user);

-- Allow users to view their own rentals
CREATE POLICY "Users can view their own rentals" 
ON public.rentals 
FOR SELECT 
USING (auth.uid() = renter_id);

-- Allow users to create rentals
CREATE POLICY "Users can create rentals" 
ON public.rentals 
FOR INSERT 
WITH CHECK (auth.uid() = renter_id);

-- Allow users to update their own rentals
CREATE POLICY "Users can update their own rentals" 
ON public.rentals 
FOR UPDATE 
USING (auth.uid() = renter_id);

-- Create storage bucket for clothing images
INSERT INTO storage.buckets (id, name, public) VALUES ('clothing-images', 'clothing-images', true);

-- Allow public access to images
CREATE POLICY "Images are publicly accessible"
ON storage.objects
FOR SELECT
USING (bucket_id = 'clothing-images');

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload images"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'clothing-images' AND auth.role() = 'authenticated');
```

3. Create the RLS (Row Level Security) policies in Supabase for the tables
4. Create a storage bucket called "clothing-images" for storing listing images

### Square Developer Setup

1. Create a Square Developer account at [developer.squareup.com](https://developer.squareup.com)
2. Create a new application in the Square Dashboard
3. Get your Sandbox Access Token from the Credentials section
4. Add it to your `.env` file as `SQUARE_ACCESS_TOKEN`

### Installation

1. Clone the repository
   ```
   git clone https://github.com/your-username/campus-closet.git
   cd campus-closet
   ```

2. Install server dependencies
   ```
   cd server
   npm install
   ```

3. Install client dependencies
   ```
   cd ../client
   npm install
   ```

4. Start the server (development mode)
   ```
   cd ../server
   npm run dev
   ```

5. Start the client (in a new terminal)
   ```
   cd ../client
   npm start
   ```

The application should now be running at `http://localhost:3000`

## Payment Testing

For testing Square payments in the sandbox environment, use these test card details:
- Card Number: `4111 1111 1111 1111`
- Expiration Date: Any future date
- CVV: Any 3 digits
- ZIP Code: Any 5 digits

## Project Structure

```
campus-closet/
│
├── client/                     # React frontend
│   ├── public/                 # Static files
│   ├── src/                    # Source files
│   │   ├── App.js              # Main App component 
│   │   ├── Dashboard.js        # Dashboard component
│   │   ├── PostListingForm.js  # Form for creating listings
│   │   ├── ListingDetailModal.js # Modal for rental & payment
│   │   ├── App.css             # Main styles
│   │   └── Dashboard.css       # Dashboard styles
│   └── package.json            # Frontend dependencies
│
├── server/                     # Node.js backend
│   ├── server.js               # Express server & API endpoints
│   └── package.json            # Backend dependencies
│
└── README.md                   # This file
```

## License

[MIT License](LICENSE)

## Heroku Deployment

To deploy this application to Heroku:

1. Create a Heroku account and install the Heroku CLI
2. Initialize a Git repository if you haven't already:
   ```
   git init
   git add .
   git commit -m "Initial commit"
   ```

3. Create a Heroku app:
   ```
   heroku create your-app-name
   ```

4. Set up environment variables on Heroku:
   ```
   heroku config:set SUPABASE_URL="your_supabase_url"
   heroku config:set SUPABASE_SERVICE_ROLE_KEY="your_service_role_key"
   heroku config:set SQUARE_ACCESS_TOKEN="your_square_access_token"
   heroku config:set NODE_ENV="production"
   ```

5. Push to Heroku:
   ```
   git push heroku main
   ```

6. Open your application:
   ```
   heroku open
   ```
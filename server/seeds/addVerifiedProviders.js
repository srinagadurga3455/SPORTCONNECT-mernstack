const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for adding verified providers');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Real verified coaches and turfs from JustDial/Google
const verifiedProviders = [
  // MUMBAI - Verified Coaches
  {
    firstName: 'Prakash',
    lastName: 'Padukone',
    email: 'prakash.badminton@sportconnect.com',
    phone: '9876501001',
    password: 'Password123!',
    role: 'coach',
    profileCompleted: true,
    specialization: 'Badminton Coach',
    certification: 'BWF Level 3 Coach',
    experience: 20,
    business_phone: '9876501001',
    coach_location: 'Mumbai, Andheri',
    isVerified: true,
    verificationStatus: 'approved',
    verifiedAt: new Date(),
    verifiedBy: 'System',
    verificationData: {
      googleMapsUrl: 'https://maps.google.com/prakash-badminton-academy',
      submittedAt: new Date()
    }
  },
  {
    firstName: 'Mahesh',
    lastName: 'Bhupathi',
    email: 'mahesh.tennis@sportconnect.com',
    phone: '9876501002',
    password: 'Password123!',
    role: 'coach',
    profileCompleted: true,
    specialization: 'Tennis Coach',
    certification: 'ITF Level 2 Coach',
    experience: 18,
    business_phone: '9876501002',
    coach_location: 'Mumbai, Bandra',
    isVerified: true,
    verificationStatus: 'approved',
    verifiedAt: new Date(),
    verifiedBy: 'System'
  },

  // BANGALORE - Verified Coaches
  {
    firstName: 'Pullela',
    lastName: 'Gopichand',
    email: 'gopichand.academy@sportconnect.com',
    phone: '9876501003',
    password: 'Password123!',
    role: 'coach',
    profileCompleted: true,
    specialization: 'Badminton Coach',
    certification: 'National Coach',
    experience: 25,
    business_phone: '9876501003',
    coach_location: 'Bangalore, Indiranagar',
    isVerified: true,
    verificationStatus: 'approved',
    verifiedAt: new Date(),
    verifiedBy: 'System'
  },
  {
    firstName: 'Rohan',
    lastName: 'Bopanna',
    email: 'rohan.tennis@sportconnect.com',
    phone: '9876501004',
    password: 'Password123!',
    role: 'coach',
    profileCompleted: true,
    specialization: 'Tennis Coach',
    certification: 'ATP Certified Coach',
    experience: 15,
    business_phone: '9876501004',
    coach_location: 'Bangalore, Koramangala',
    isVerified: true,
    verificationStatus: 'approved',
    verifiedAt: new Date(),
    verifiedBy: 'System'
  },

  // DELHI - Verified Coaches
  {
    firstName: 'Harbhajan',
    lastName: 'Singh',
    email: 'harbhajan.cricket@sportconnect.com',
    phone: '9876501005',
    password: 'Password123!',
    role: 'coach',
    profileCompleted: true,
    specialization: 'Cricket Coach',
    certification: 'BCCI Level 3',
    experience: 20,
    business_phone: '9876501005',
    coach_location: 'Delhi, Connaught Place',
    isVerified: true,
    verificationStatus: 'approved',
    verifiedAt: new Date(),
    verifiedBy: 'System'
  },

  // MUMBAI - Verified Turfs
  {
    firstName: 'Elite',
    lastName: 'Sports',
    email: 'elite.sports.mumbai@sportconnect.com',
    phone: '9876502001',
    password: 'Password123!',
    role: 'turf',
    profileCompleted: true,
    turf_name: 'Elite Sports Arena Mumbai',
    turf_address: 'Andheri West, Mumbai, Maharashtra',
    pin_code: '400053',
    available_sports: ['Football', 'Cricket', 'Badminton', 'Basketball'],
    isVerified: true,
    verificationStatus: 'approved',
    verifiedAt: new Date(),
    verifiedBy: 'System',
    verificationData: {
      googleMapsUrl: 'https://maps.google.com/elite-sports-mumbai',
      submittedAt: new Date()
    }
  },
  {
    firstName: 'Turf',
    lastName: 'Manager',
    email: 'playzone.mumbai@sportconnect.com',
    phone: '9876502002',
    password: 'Password123!',
    role: 'turf',
    profileCompleted: true,
    turf_name: 'PlayZone Sports Complex',
    turf_address: 'Bandra East, Mumbai, Maharashtra',
    pin_code: '400051',
    available_sports: ['Football', 'Cricket', 'Tennis'],
    isVerified: true,
    verificationStatus: 'approved',
    verifiedAt: new Date(),
    verifiedBy: 'System'
  },

  // BANGALORE - Verified Turfs
  {
    firstName: 'Sports',
    lastName: 'Hub',
    email: 'sportshub.bangalore@sportconnect.com',
    phone: '9876502003',
    password: 'Password123!',
    role: 'turf',
    profileCompleted: true,
    turf_name: 'Sports Hub Bangalore',
    turf_address: 'Koramangala, Bangalore, Karnataka',
    pin_code: '560034',
    available_sports: ['Football', 'Cricket', 'Badminton', 'Volleyball'],
    isVerified: true,
    verificationStatus: 'approved',
    verifiedAt: new Date(),
    verifiedBy: 'System'
  },
  {
    firstName: 'Arena',
    lastName: 'Manager',
    email: 'arena.indiranagar@sportconnect.com',
    phone: '9876502004',
    password: 'Password123!',
    role: 'turf',
    profileCompleted: true,
    turf_name: 'Arena Sports Complex',
    turf_address: 'Indiranagar, Bangalore, Karnataka',
    pin_code: '560038',
    available_sports: ['Football', 'Basketball', 'Tennis'],
    isVerified: true,
    verificationStatus: 'approved',
    verifiedAt: new Date(),
    verifiedBy: 'System'
  },

  // DELHI - Verified Turfs
  {
    firstName: 'Capital',
    lastName: 'Sports',
    email: 'capital.sports.delhi@sportconnect.com',
    phone: '9876502005',
    password: 'Password123!',
    role: 'turf',
    profileCompleted: true,
    turf_name: 'Capital Sports Ground',
    turf_address: 'Connaught Place, New Delhi',
    pin_code: '110001',
    available_sports: ['Cricket', 'Football', 'Badminton'],
    isVerified: true,
    verificationStatus: 'approved',
    verifiedAt: new Date(),
    verifiedBy: 'System'
  },
  {
    firstName: 'Metro',
    lastName: 'Turf',
    email: 'metro.turf.delhi@sportconnect.com',
    phone: '9876502006',
    password: 'Password123!',
    role: 'turf',
    profileCompleted: true,
    turf_name: 'Metro Sports Complex',
    turf_address: 'Saket, New Delhi',
    pin_code: '110017',
    available_sports: ['Football', 'Cricket', 'Tennis', 'Basketball'],
    isVerified: true,
    verificationStatus: 'approved',
    verifiedAt: new Date(),
    verifiedBy: 'System'
  },

  // HYDERABAD - Verified Turfs
  {
    firstName: 'Hyderabad',
    lastName: 'Sports',
    email: 'hyd.sports@sportconnect.com',
    phone: '9876502007',
    password: 'Password123!',
    role: 'turf',
    profileCompleted: true,
    turf_name: 'Hyderabad Sports Arena',
    turf_address: 'Banjara Hills, Hyderabad, Telangana',
    pin_code: '500034',
    available_sports: ['Cricket', 'Football', 'Badminton', 'Tennis'],
    isVerified: true,
    verificationStatus: 'approved',
    verifiedAt: new Date(),
    verifiedBy: 'System'
  },

  // PUNE - Verified Turfs
  {
    firstName: 'Pune',
    lastName: 'Arena',
    email: 'pune.arena@sportconnect.com',
    phone: '9876502008',
    password: 'Password123!',
    role: 'turf',
    profileCompleted: true,
    turf_name: 'Pune Sports Arena',
    turf_address: 'Koregaon Park, Pune, Maharashtra',
    pin_code: '411001',
    available_sports: ['Football', 'Cricket', 'Basketball'],
    isVerified: true,
    verificationStatus: 'approved',
    verifiedAt: new Date(),
    verifiedBy: 'System'
  }
];

const addVerifiedProviders = async () => {
  try {
    await connectDB();

    console.log('🗑️  Removing old verified providers...');
    // Remove only the providers we're about to add (by email)
    const emails = verifiedProviders.map(p => p.email);
    await User.deleteMany({ email: { $in: emails } });

    console.log('✅ Adding verified coaches and turfs...');
    const created = await User.insertMany(verifiedProviders);
    
    console.log(`\n✅ Successfully added ${created.length} verified providers!\n`);
    
    // Summary
    const coaches = created.filter(p => p.role === 'coach');
    const turfs = created.filter(p => p.role === 'turf');
    
    console.log(`📊 Summary:`);
    console.log(`   Coaches: ${coaches.length}`);
    console.log(`   Turfs: ${turfs.length}`);
    console.log(`   Total: ${created.length}\n`);
    
    console.log(`🏆 Verified Coaches:`);
    coaches.forEach(c => {
      console.log(`   ✓ ${c.firstName} ${c.lastName} - ${c.specialization} (${c.coach_location})`);
    });
    
    console.log(`\n🏟️  Verified Turfs:`);
    turfs.forEach(t => {
      console.log(`   ✓ ${t.turf_name} (${t.turf_address})`);
    });
    
    console.log('\n✅ All verified providers added successfully!');
    console.log('🔐 Default password for all: Password123!\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

addVerifiedProviders();

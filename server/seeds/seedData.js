const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Turf = require('../models/Turf');
const Booking = require('../models/Booking');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for seeding');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const seedUsers = [
  // Test Players
  {
    firstName: 'John',
    lastName: 'Player',
    email: 'player@test.com',
    phone: '1234567890',
    password: 'password123',
    role: 'player',
    profileCompleted: true,
    sport: 'Football',
    skill_level: 'intermediate',
    location: 'Mumbai'
  },
  {
    firstName: 'Priya',
    lastName: 'Sharma',
    email: 'player2@test.com',
    phone: '1234567899',
    password: 'password123',
    role: 'player',
    profileCompleted: true,
    sport: 'Badminton',
    skill_level: 'advanced',
    location: 'Bangalore'
  },

  // MUMBAI COACHES
  {
    firstName: 'Rahul',
    lastName: 'Dravid',
    email: 'rahul.coach@sportconnect.com',
    phone: '9876543210',
    password: 'password123',
    role: 'coach',
    profileCompleted: true,
    specialization: 'Cricket Coach',
    certification: 'BCCI Level 3 Coaching Certificate',
    experience: 15,
    business_phone: '9876543210',
    coach_location: 'Mumbai, Andheri',
    isVerified: true,
    verificationStatus: 'approved',
    verifiedAt: new Date(),
    verifiedBy: 'Admin'
  },
  {
    firstName: 'Sunil',
    lastName: 'Chhetri',
    email: 'sunil.coach@sportconnect.com',
    phone: '9876543211',
    password: 'password123',
    role: 'coach',
    profileCompleted: true,
    specialization: 'Football Coach',
    certification: 'AFC B License',
    experience: 12,
    business_phone: '9876543211',
    coach_location: 'Mumbai, Bandra',
    isVerified: true,
    verificationStatus: 'approved',
    verifiedAt: new Date(),
    verifiedBy: 'Admin'
  },
  {
    firstName: 'Saina',
    lastName: 'Nehwal',
    email: 'saina.coach@sportconnect.com',
    phone: '9876543212',
    password: 'password123',
    role: 'coach',
    profileCompleted: true,
    specialization: 'Badminton Coach',
    certification: 'BWF Level 2 Coach',
    experience: 10,
    business_phone: '9876543212',
    coach_location: 'Mumbai, Powai',
    isVerified: true,
    verificationStatus: 'approved',
    verifiedAt: new Date(),
    verifiedBy: 'Admin'
  },

  // DELHI COACHES
  {
    firstName: 'Virat',
    lastName: 'Singh',
    email: 'virat.coach@sportconnect.com',
    phone: '9876543213',
    password: 'password123',
    role: 'coach',
    profileCompleted: true,
    specialization: 'Cricket Coach',
    certification: 'BCCI Level 2 Coaching Certificate',
    experience: 8,
    business_phone: '9876543213',
    coach_location: 'Delhi, Connaught Place'
  },
  {
    firstName: 'Bhaichung',
    lastName: 'Bhutia',
    email: 'bhaichung.coach@sportconnect.com',
    phone: '9876543214',
    password: 'password123',
    role: 'coach',
    profileCompleted: true,
    specialization: 'Football Coach',
    certification: 'UEFA A License',
    experience: 18,
    business_phone: '9876543214',
    coach_location: 'Delhi, Karol Bagh'
  },
  {
    firstName: 'Leander',
    lastName: 'Paes',
    email: 'leander.coach@sportconnect.com',
    phone: '9876543215',
    password: 'password123',
    role: 'coach',
    profileCompleted: true,
    specialization: 'Tennis Coach',
    certification: 'ITF Level 3 Coach',
    experience: 20,
    business_phone: '9876543215',
    coach_location: 'Delhi, Vasant Vihar'
  },

  // BANGALORE COACHES
  {
    firstName: 'Anil',
    lastName: 'Kumble',
    email: 'anil.coach@sportconnect.com',
    phone: '9876543216',
    password: 'password123',
    role: 'coach',
    profileCompleted: true,
    specialization: 'Cricket Coach',
    certification: 'BCCI Level 3 Coaching Certificate',
    experience: 16,
    business_phone: '9876543216',
    coach_location: 'Bangalore, Indiranagar'
  },
  {
    firstName: 'Mahesh',
    lastName: 'Bhupathi',
    email: 'mahesh.coach@sportconnect.com',
    phone: '9876543217',
    password: 'password123',
    role: 'coach',
    profileCompleted: true,
    specialization: 'Tennis Coach',
    certification: 'ITF Level 2 Coach',
    experience: 14,
    business_phone: '9876543217',
    coach_location: 'Bangalore, Koramangala'
  },
  {
    firstName: 'Prakash',
    lastName: 'Padukone',
    email: 'prakash.coach@sportconnect.com',
    phone: '9876543218',
    password: 'password123',
    role: 'coach',
    profileCompleted: true,
    specialization: 'Badminton Coach',
    certification: 'BWF Level 3 Coach',
    experience: 25,
    business_phone: '9876543218',
    coach_location: 'Bangalore, Whitefield'
  },

  // PUNE COACHES
  {
    firstName: 'Sachin',
    lastName: 'Tendulkar',
    email: 'sachin.coach@sportconnect.com',
    phone: '9876543219',
    password: 'password123',
    role: 'coach',
    profileCompleted: true,
    specialization: 'Cricket Coach',
    certification: 'BCCI Master Coach',
    experience: 22,
    business_phone: '9876543219',
    coach_location: 'Pune, Koregaon Park'
  },
  {
    firstName: 'Baichung',
    lastName: 'Kumar',
    email: 'baichung.coach@sportconnect.com',
    phone: '9876543220',
    password: 'password123',
    role: 'coach',
    profileCompleted: true,
    specialization: 'Football Coach',
    certification: 'AFC A License',
    experience: 11,
    business_phone: '9876543220',
    coach_location: 'Pune, Viman Nagar'
  },

  // HYDERABAD COACHES
  {
    firstName: 'VVS',
    lastName: 'Laxman',
    email: 'vvs.coach@sportconnect.com',
    phone: '9876543221',
    password: 'password123',
    role: 'coach',
    profileCompleted: true,
    specialization: 'Cricket Coach',
    certification: 'BCCI Level 3 Coaching Certificate',
    experience: 13,
    business_phone: '9876543221',
    coach_location: 'Hyderabad, Banjara Hills'
  },
  {
    firstName: 'Pullela',
    lastName: 'Gopichand',
    email: 'gopichand.coach@sportconnect.com',
    phone: '9876543222',
    password: 'password123',
    role: 'coach',
    profileCompleted: true,
    specialization: 'Badminton Coach',
    certification: 'BWF Level 3 Coach',
    experience: 19,
    business_phone: '9876543222',
    coach_location: 'Hyderabad, Gachibowli'
  },

  // CHENNAI COACHES
  {
    firstName: 'Ashwin',
    lastName: 'Ravichandran',
    email: 'ashwin.coach@sportconnect.com',
    phone: '9876543223',
    password: 'password123',
    role: 'coach',
    profileCompleted: true,
    specialization: 'Cricket Coach',
    certification: 'BCCI Level 2 Coaching Certificate',
    experience: 9,
    business_phone: '9876543223',
    coach_location: 'Chennai, T Nagar'
  },
  {
    firstName: 'Ramesh',
    lastName: 'Krishnan',
    email: 'ramesh.coach@sportconnect.com',
    phone: '9876543224',
    password: 'password123',
    role: 'coach',
    profileCompleted: true,
    specialization: 'Tennis Coach',
    certification: 'ITF Level 2 Coach',
    experience: 17,
    business_phone: '9876543224',
    coach_location: 'Chennai, Adyar'
  },

  // KOLKATA COACHES
  {
    firstName: 'Sourav',
    lastName: 'Ganguly',
    email: 'sourav.coach@sportconnect.com',
    phone: '9876543225',
    password: 'password123',
    role: 'coach',
    profileCompleted: true,
    specialization: 'Cricket Coach',
    certification: 'BCCI Master Coach',
    experience: 20,
    business_phone: '9876543225',
    coach_location: 'Kolkata, Salt Lake'
  },
  {
    firstName: 'Subrata',
    lastName: 'Pal',
    email: 'subrata.coach@sportconnect.com',
    phone: '9876543226',
    password: 'password123',
    role: 'coach',
    profileCompleted: true,
    specialization: 'Football Coach',
    certification: 'AFC B License',
    experience: 10,
    business_phone: '9876543226',
    coach_location: 'Kolkata, Park Street'
  },

  // ADDITIONAL MUMBAI COACHES
  {
    firstName: 'Rohit',
    lastName: 'Sharma',
    email: 'rohit.coach@sportconnect.com',
    phone: '9876543227',
    password: 'password123',
    role: 'coach',
    profileCompleted: true,
    specialization: 'Cricket Coach',
    certification: 'BCCI Level 2 Coach',
    experience: 7,
    business_phone: '9876543227',
    coach_location: 'Mumbai, Borivali'
  },
  {
    firstName: 'Mary',
    lastName: 'Kom',
    email: 'mary.coach@sportconnect.com',
    phone: '9876543228',
    password: 'password123',
    role: 'coach',
    profileCompleted: true,
    specialization: 'Boxing Coach',
    certification: 'International Boxing Coach',
    experience: 15,
    business_phone: '9876543228',
    coach_location: 'Mumbai, Dadar'
  },
  {
    firstName: 'Abhinav',
    lastName: 'Bindra',
    email: 'abhinav.coach@sportconnect.com',
    phone: '9876543229',
    password: 'password123',
    role: 'coach',
    profileCompleted: true,
    specialization: 'Shooting Coach',
    certification: 'Olympic Level Coach',
    experience: 18,
    business_phone: '9876543229',
    coach_location: 'Mumbai, Juhu'
  },

  // ADDITIONAL DELHI COACHES
  {
    firstName: 'Sushil',
    lastName: 'Kumar',
    email: 'sushil.coach@sportconnect.com',
    phone: '9876543230',
    password: 'password123',
    role: 'coach',
    profileCompleted: true,
    specialization: 'Wrestling Coach',
    certification: 'Olympic Wrestling Coach',
    experience: 16,
    business_phone: '9876543230',
    coach_location: 'Delhi, Dwarka'
  },
  {
    firstName: 'Sania',
    lastName: 'Mirza',
    email: 'sania.coach@sportconnect.com',
    phone: '9876543231',
    password: 'password123',
    role: 'coach',
    profileCompleted: true,
    specialization: 'Tennis Coach',
    certification: 'ITF Level 3 Coach',
    experience: 12,
    business_phone: '9876543231',
    coach_location: 'Delhi, Rohini'
  },

  // ADDITIONAL BANGALORE COACHES
  {
    firstName: 'Pankaj',
    lastName: 'Advani',
    email: 'pankaj.coach@sportconnect.com',
    phone: '9876543232',
    password: 'password123',
    role: 'coach',
    profileCompleted: true,
    specialization: 'Billiards Coach',
    certification: 'World Champion Coach',
    experience: 14,
    business_phone: '9876543232',
    coach_location: 'Bangalore, HSR Layout'
  },
  {
    firstName: 'Viswanathan',
    lastName: 'Anand',
    email: 'vishy.coach@sportconnect.com',
    phone: '9876543233',
    password: 'password123',
    role: 'coach',
    profileCompleted: true,
    specialization: 'Chess Coach',
    certification: 'Grandmaster Coach',
    experience: 25,
    business_phone: '9876543233',
    coach_location: 'Bangalore, Jayanagar'
  },

  // JAIPUR COACHES
  {
    firstName: 'Rajesh',
    lastName: 'Verma',
    email: 'rajesh.coach@sportconnect.com',
    phone: '9876543234',
    password: 'password123',
    role: 'coach',
    profileCompleted: true,
    specialization: 'Cricket Coach',
    certification: 'BCCI Level 2 Coach',
    experience: 9,
    business_phone: '9876543234',
    coach_location: 'Jaipur, Malviya Nagar'
  },
  {
    firstName: 'Deepika',
    lastName: 'Kumari',
    email: 'deepika.coach@sportconnect.com',
    phone: '9876543235',
    password: 'password123',
    role: 'coach',
    profileCompleted: true,
    specialization: 'Archery Coach',
    certification: 'National Archery Coach',
    experience: 11,
    business_phone: '9876543235',
    coach_location: 'Jaipur, Vaishali Nagar'
  },

  // AHMEDABAD COACHES
  {
    firstName: 'Hardik',
    lastName: 'Pandya',
    email: 'hardik.coach@sportconnect.com',
    phone: '9876543236',
    password: 'password123',
    role: 'coach',
    profileCompleted: true,
    specialization: 'Cricket Coach',
    certification: 'BCCI Level 1 Coach',
    experience: 6,
    business_phone: '9876543236',
    coach_location: 'Ahmedabad, Satellite'
  },
  {
    firstName: 'Geeta',
    lastName: 'Phogat',
    email: 'geeta.coach@sportconnect.com',
    phone: '9876543237',
    password: 'password123',
    role: 'coach',
    profileCompleted: true,
    specialization: 'Wrestling Coach',
    certification: 'Commonwealth Wrestling Coach',
    experience: 13,
    business_phone: '9876543237',
    coach_location: 'Ahmedabad, Bodakdev'
  },

  // BHIMAVARAM COACHES (LOCAL)
  {
    firstName: 'Venkat',
    lastName: 'Rao',
    email: 'venkat.coach@sportconnect.com',
    phone: '9876543238',
    password: 'password123',
    role: 'coach',
    profileCompleted: true,
    specialization: 'Cricket Coach',
    certification: 'BCCI Level 2 Coach',
    experience: 10,
    business_phone: '9876543238',
    coach_location: 'Bhimavaram, Youth Club Road'
  },
  {
    firstName: 'Lakshmi',
    lastName: 'Devi',
    email: 'lakshmi.coach@sportconnect.com',
    phone: '9876543239',
    password: 'password123',
    role: 'coach',
    profileCompleted: true,
    specialization: 'Badminton Coach',
    certification: 'BWF Level 2 Coach',
    experience: 8,
    business_phone: '9876543239',
    coach_location: 'Bhimavaram, Opp Bhavans Road'
  },
  {
    firstName: 'Ravi',
    lastName: 'Kumar',
    email: 'ravi.coach@sportconnect.com',
    phone: '9876543240',
    password: 'password123',
    role: 'coach',
    profileCompleted: true,
    specialization: 'Football Coach',
    certification: 'AFC C License',
    experience: 7,
    business_phone: '9876543240',
    coach_location: 'Bhimavaram, SRKR College Road'
  },
  {
    firstName: 'Sita',
    lastName: 'Reddy',
    email: 'sita.coach@sportconnect.com',
    phone: '9876543241',
    password: 'password123',
    role: 'coach',
    profileCompleted: true,
    specialization: 'Volleyball Coach',
    certification: 'National Volleyball Coach',
    experience: 9,
    business_phone: '9876543241',
    coach_location: 'Bhimavaram, DNR Ground Area'
  },
  {
    firstName: 'Krishna',
    lastName: 'Murthy',
    email: 'krishna.coach@sportconnect.com',
    phone: '9876543242',
    password: 'password123',
    role: 'coach',
    profileCompleted: true,
    specialization: 'Basketball Coach',
    certification: 'Basketball Federation Coach',
    experience: 6,
    business_phone: '9876543242',
    coach_location: 'Bhimavaram, Main Road'
  },

  // MUMBAI TURFS (Real Local Places)
  {
    firstName: 'Turf',
    lastName: 'Owner1',
    email: 'turf.wankhede@sportconnect.com',
    phone: '9123456780',
    password: 'password123',
    role: 'turf',
    profileCompleted: true,
    turf_name: 'Wankhede Stadium Practice Ground',
    turf_address: 'D Road, Churchgate, Mumbai, Maharashtra',
    pin_code: '400020',
    available_sports: ['Cricket', 'Football']
  },
  {
    firstName: 'Turf',
    lastName: 'Owner1a',
    email: 'turf.brabourne@sportconnect.com',
    phone: '9123456780',
    password: 'password123',
    role: 'turf',
    profileCompleted: true,
    turf_name: 'Brabourne Stadium Sports Complex',
    turf_address: 'Veer Nariman Road, Churchgate, Mumbai',
    pin_code: '400020',
    available_sports: ['Cricket', 'Tennis', 'Badminton']
  },
  {
    firstName: 'Turf',
    lastName: 'Owner1b',
    email: 'turf.andheri@sportconnect.com',
    phone: '9123456781',
    password: 'password123',
    role: 'turf',
    profileCompleted: true,
    turf_name: 'Andheri Sports Complex',
    turf_address: 'Andheri West, Mumbai, Maharashtra',
    pin_code: '400053',
    available_sports: ['Football', 'Cricket', 'Basketball']
  },
  {
    firstName: 'Turf',
    lastName: 'Owner2',
    email: 'turf.bandra@sportconnect.com',
    phone: '9123456782',
    password: 'password123',
    role: 'turf',
    profileCompleted: true,
    turf_name: 'Bandra Reclamation Sports Ground',
    turf_address: 'Bandra Reclamation, Bandra West, Mumbai',
    pin_code: '400050',
    available_sports: ['Football', 'Cricket', 'Jogging Track']
  },
  {
    firstName: 'Turf',
    lastName: 'Owner2a',
    email: 'turf.shivaji@sportconnect.com',
    phone: '9123456783',
    password: 'password123',
    role: 'turf',
    profileCompleted: true,
    turf_name: 'Shivaji Park Sports Ground',
    turf_address: 'Shivaji Park, Dadar, Mumbai',
    pin_code: '400028',
    available_sports: ['Cricket', 'Football', 'Tennis']
  },
  {
    firstName: 'Turf',
    lastName: 'Owner3',
    email: 'turf.powai@sportconnect.com',
    phone: '9123456782',
    password: 'password123',
    role: 'turf',
    profileCompleted: true,
    turf_name: 'Powai Sports Hub',
    turf_address: 'Powai, Mumbai, Maharashtra',
    pin_code: '400076',
    available_sports: ['Cricket', 'Football', 'Volleyball']
  },

  // DELHI TURFS (Real Local Places)
  {
    firstName: 'Turf',
    lastName: 'Owner4',
    email: 'turf.jawaharlal@sportconnect.com',
    phone: '9123456784',
    password: 'password123',
    role: 'turf',
    profileCompleted: true,
    turf_name: 'Jawaharlal Nehru Stadium',
    turf_address: 'Pragati Vihar, New Delhi',
    pin_code: '110003',
    available_sports: ['Football', 'Athletics', 'Cricket']
  },
  {
    firstName: 'Turf',
    lastName: 'Owner4a',
    email: 'turf.thyagaraj@sportconnect.com',
    phone: '9123456785',
    password: 'password123',
    role: 'turf',
    profileCompleted: true,
    turf_name: 'Thyagaraj Sports Complex',
    turf_address: 'INA Colony, New Delhi',
    pin_code: '110023',
    available_sports: ['Badminton', 'Swimming', 'Basketball']
  },
  {
    firstName: 'Turf',
    lastName: 'Owner4b',
    email: 'turf.karolbagh@sportconnect.com',
    phone: '9123456786',
    password: 'password123',
    role: 'turf',
    profileCompleted: true,
    turf_name: 'Karol Bagh Sports Complex',
    turf_address: 'Karol Bagh, New Delhi',
    pin_code: '110005',
    available_sports: ['Cricket', 'Football', 'Tennis']
  },
  {
    firstName: 'Turf',
    lastName: 'Owner5',
    email: 'turf.vasantvihar@sportconnect.com',
    phone: '9123456784',
    password: 'password123',
    role: 'turf',
    profileCompleted: true,
    turf_name: 'Elite Sports Arena',
    turf_address: 'Vasant Vihar, New Delhi',
    pin_code: '110057',
    available_sports: ['Tennis', 'Badminton', 'Squash']
  },
  {
    firstName: 'Turf',
    lastName: 'Owner6',
    email: 'turf.cp@sportconnect.com',
    phone: '9123456785',
    password: 'password123',
    role: 'turf',
    profileCompleted: true,
    turf_name: 'Central Sports Complex',
    turf_address: 'Connaught Place, New Delhi',
    pin_code: '110001',
    available_sports: ['Football', 'Basketball', 'Cricket']
  },

  // BANGALORE TURFS (Real Local Places)
  {
    firstName: 'Turf',
    lastName: 'Owner7',
    email: 'turf.chinnaswamy@sportconnect.com',
    phone: '9123456787',
    password: 'password123',
    role: 'turf',
    profileCompleted: true,
    turf_name: 'M Chinnaswamy Stadium Practice Area',
    turf_address: 'MG Road, Bangalore, Karnataka',
    pin_code: '560001',
    available_sports: ['Cricket', 'Football']
  },
  {
    firstName: 'Turf',
    lastName: 'Owner7a',
    email: 'turf.kanteerava@sportconnect.com',
    phone: '9123456788',
    password: 'password123',
    role: 'turf',
    profileCompleted: true,
    turf_name: 'Kanteerava Stadium',
    turf_address: 'Kasturba Road, Bangalore, Karnataka',
    pin_code: '560001',
    available_sports: ['Football', 'Athletics', 'Basketball']
  },
  {
    firstName: 'Turf',
    lastName: 'Owner7b',
    email: 'turf.indiranagar@sportconnect.com',
    phone: '9123456789',
    password: 'password123',
    role: 'turf',
    profileCompleted: true,
    turf_name: 'Indiranagar Sports Club',
    turf_address: 'Indiranagar, Bangalore, Karnataka',
    pin_code: '560038',
    available_sports: ['Cricket', 'Football', 'Tennis', 'Badminton']
  },
  {
    firstName: 'Turf',
    lastName: 'Owner8',
    email: 'turf.koramangala@sportconnect.com',
    phone: '9123456787',
    password: 'password123',
    role: 'turf',
    profileCompleted: true,
    turf_name: 'Koramangala Sports Arena',
    turf_address: 'Koramangala, Bangalore, Karnataka',
    pin_code: '560034',
    available_sports: ['Badminton', 'Tennis', 'Basketball']
  },
  {
    firstName: 'Turf',
    lastName: 'Owner9',
    email: 'turf.whitefield@sportconnect.com',
    phone: '9123456788',
    password: 'password123',
    role: 'turf',
    profileCompleted: true,
    turf_name: 'Whitefield Sports Complex',
    turf_address: 'Whitefield, Bangalore, Karnataka',
    pin_code: '560066',
    available_sports: ['Football', 'Cricket', 'Volleyball']
  },

  // PUNE TURFS
  {
    firstName: 'Turf',
    lastName: 'Owner10',
    email: 'turf.koregaon@sportconnect.com',
    phone: '9123456789',
    password: 'password123',
    role: 'turf',
    profileCompleted: true,
    turf_name: 'Koregaon Park Sports Hub',
    turf_address: 'Koregaon Park, Pune, Maharashtra',
    pin_code: '411001',
    available_sports: ['Cricket', 'Football', 'Tennis']
  },
  {
    firstName: 'Turf',
    lastName: 'Owner11',
    email: 'turf.viman@sportconnect.com',
    phone: '9123456790',
    password: 'password123',
    role: 'turf',
    profileCompleted: true,
    turf_name: 'Viman Nagar Sports Arena',
    turf_address: 'Viman Nagar, Pune, Maharashtra',
    pin_code: '411014',
    available_sports: ['Football', 'Basketball', 'Badminton']
  },

  // HYDERABAD TURFS (Real Local Places)
  {
    firstName: 'Turf',
    lastName: 'Owner12',
    email: 'turf.uppal@sportconnect.com',
    phone: '9123456791',
    password: 'password123',
    role: 'turf',
    profileCompleted: true,
    turf_name: 'Rajiv Gandhi International Cricket Stadium',
    turf_address: 'Uppal, Hyderabad, Telangana',
    pin_code: '500039',
    available_sports: ['Cricket', 'Football']
  },
  {
    firstName: 'Turf',
    lastName: 'Owner12a',
    email: 'turf.lbstadium@sportconnect.com',
    phone: '9123456792',
    password: 'password123',
    role: 'turf',
    profileCompleted: true,
    turf_name: 'LB Stadium Sports Complex',
    turf_address: 'Basheerbagh, Hyderabad, Telangana',
    pin_code: '500029',
    available_sports: ['Football', 'Athletics', 'Basketball']
  },
  {
    firstName: 'Turf',
    lastName: 'Owner12b',
    email: 'turf.banjara@sportconnect.com',
    phone: '9123456793',
    password: 'password123',
    role: 'turf',
    profileCompleted: true,
    turf_name: 'Banjara Hills Sports Club',
    turf_address: 'Banjara Hills, Hyderabad, Telangana',
    pin_code: '500034',
    available_sports: ['Cricket', 'Tennis', 'Badminton', 'Swimming']
  },
  {
    firstName: 'Turf',
    lastName: 'Owner13',
    email: 'turf.gachibowli@sportconnect.com',
    phone: '9123456792',
    password: 'password123',
    role: 'turf',
    profileCompleted: true,
    turf_name: 'Gachibowli Sports Complex',
    turf_address: 'Gachibowli, Hyderabad, Telangana',
    pin_code: '500032',
    available_sports: ['Football', 'Cricket', 'Basketball']
  },

  // CHENNAI TURFS (Real Local Places)
  {
    firstName: 'Turf',
    lastName: 'Owner14',
    email: 'turf.chepauk@sportconnect.com',
    phone: '9123456793',
    password: 'password123',
    role: 'turf',
    profileCompleted: true,
    turf_name: 'MA Chidambaram Stadium (Chepauk)',
    turf_address: 'Chepauk, Chennai, Tamil Nadu',
    pin_code: '600005',
    available_sports: ['Cricket', 'Football']
  },
  {
    firstName: 'Turf',
    lastName: 'Owner14a',
    email: 'turf.nehru@sportconnect.com',
    phone: '9123456794',
    password: 'password123',
    role: 'turf',
    profileCompleted: true,
    turf_name: 'Nehru Stadium Chennai',
    turf_address: 'Park Town, Chennai, Tamil Nadu',
    pin_code: '600003',
    available_sports: ['Football', 'Athletics', 'Basketball']
  },
  {
    firstName: 'Turf',
    lastName: 'Owner14b',
    email: 'turf.tnagar@sportconnect.com',
    phone: '9123456795',
    password: 'password123',
    role: 'turf',
    profileCompleted: true,
    turf_name: 'T Nagar Sports Complex',
    turf_address: 'T Nagar, Chennai, Tamil Nadu',
    pin_code: '600017',
    available_sports: ['Cricket', 'Football', 'Tennis', 'Badminton']
  },
  {
    firstName: 'Turf',
    lastName: 'Owner15',
    email: 'turf.adyar@sportconnect.com',
    phone: '9123456794',
    password: 'password123',
    role: 'turf',
    profileCompleted: true,
    turf_name: 'Adyar Sports Club',
    turf_address: 'Adyar, Chennai, Tamil Nadu',
    pin_code: '600020',
    available_sports: ['Tennis', 'Badminton', 'Squash']
  },

  // KOLKATA TURFS (Real Local Places)
  {
    firstName: 'Turf',
    lastName: 'Owner16',
    email: 'turf.eden@sportconnect.com',
    phone: '9123456796',
    password: 'password123',
    role: 'turf',
    profileCompleted: true,
    turf_name: 'Eden Gardens Practice Ground',
    turf_address: 'BBD Bagh, Kolkata, West Bengal',
    pin_code: '700021',
    available_sports: ['Cricket', 'Football']
  },
  {
    firstName: 'Turf',
    lastName: 'Owner16a',
    email: 'turf.saltlake@sportconnect.com',
    phone: '9123456797',
    password: 'password123',
    role: 'turf',
    profileCompleted: true,
    turf_name: 'Salt Lake Stadium (Yuva Bharati)',
    turf_address: 'Salt Lake, Kolkata, West Bengal',
    pin_code: '700064',
    available_sports: ['Football', 'Cricket', 'Athletics']
  },
  {
    firstName: 'Turf',
    lastName: 'Owner16b',
    email: 'turf.maidan@sportconnect.com',
    phone: '9123456798',
    password: 'password123',
    role: 'turf',
    profileCompleted: true,
    turf_name: 'Maidan Sports Ground',
    turf_address: 'Maidan, Kolkata, West Bengal',
    pin_code: '700071',
    available_sports: ['Football', 'Cricket', 'Rugby']
  },
  {
    firstName: 'Turf',
    lastName: 'Owner17',
    email: 'turf.parkstreet@sportconnect.com',
    phone: '9123456796',
    password: 'password123',
    role: 'turf',
    profileCompleted: true,
    turf_name: 'Park Street Sports Hub',
    turf_address: 'Park Street, Kolkata, West Bengal',
    pin_code: '700016',
    available_sports: ['Tennis', 'Badminton', 'Cricket']
  },

  // ADDITIONAL MUMBAI TURFS
  {
    firstName: 'Turf',
    lastName: 'Owner18',
    email: 'turf.borivali@sportconnect.com',
    phone: '9123456797',
    password: 'password123',
    role: 'turf',
    profileCompleted: true,
    turf_name: 'Borivali Sports Arena',
    turf_address: 'Borivali West, Mumbai, Maharashtra',
    pin_code: '400092',
    available_sports: ['Football', 'Cricket', 'Volleyball']
  },
  {
    firstName: 'Turf',
    lastName: 'Owner19',
    email: 'turf.dadar@sportconnect.com',
    phone: '9123456798',
    password: 'password123',
    role: 'turf',
    profileCompleted: true,
    turf_name: 'Dadar Sports Club',
    turf_address: 'Dadar East, Mumbai, Maharashtra',
    pin_code: '400014',
    available_sports: ['Badminton', 'Tennis', 'Squash']
  },
  {
    firstName: 'Turf',
    lastName: 'Owner20',
    email: 'turf.juhu@sportconnect.com',
    phone: '9123456799',
    password: 'password123',
    role: 'turf',
    profileCompleted: true,
    turf_name: 'Juhu Beach Sports Complex',
    turf_address: 'Juhu, Mumbai, Maharashtra',
    pin_code: '400049',
    available_sports: ['Football', 'Beach Volleyball', 'Cricket']
  },

  // ADDITIONAL DELHI TURFS
  {
    firstName: 'Turf',
    lastName: 'Owner21',
    email: 'turf.dwarka@sportconnect.com',
    phone: '9123456800',
    password: 'password123',
    role: 'turf',
    profileCompleted: true,
    turf_name: 'Dwarka Sports Arena',
    turf_address: 'Dwarka Sector 10, New Delhi',
    pin_code: '110075',
    available_sports: ['Football', 'Basketball', 'Cricket']
  },
  {
    firstName: 'Turf',
    lastName: 'Owner22',
    email: 'turf.rohini@sportconnect.com',
    phone: '9123456801',
    password: 'password123',
    role: 'turf',
    profileCompleted: true,
    turf_name: 'Rohini Sports Complex',
    turf_address: 'Rohini Sector 15, New Delhi',
    pin_code: '110089',
    available_sports: ['Tennis', 'Badminton', 'Table Tennis']
  },

  // ADDITIONAL BANGALORE TURFS
  {
    firstName: 'Turf',
    lastName: 'Owner23',
    email: 'turf.hsr@sportconnect.com',
    phone: '9123456802',
    password: 'password123',
    role: 'turf',
    profileCompleted: true,
    turf_name: 'HSR Sports Hub',
    turf_address: 'HSR Layout, Bangalore, Karnataka',
    pin_code: '560102',
    available_sports: ['Football', 'Cricket', 'Badminton']
  },
  {
    firstName: 'Turf',
    lastName: 'Owner24',
    email: 'turf.jayanagar@sportconnect.com',
    phone: '9123456803',
    password: 'password123',
    role: 'turf',
    profileCompleted: true,
    turf_name: 'Jayanagar Sports Arena',
    turf_address: 'Jayanagar 4th Block, Bangalore, Karnataka',
    pin_code: '560011',
    available_sports: ['Tennis', 'Basketball', 'Volleyball']
  },

  // JAIPUR TURFS
  {
    firstName: 'Turf',
    lastName: 'Owner25',
    email: 'turf.malviya@sportconnect.com',
    phone: '9123456804',
    password: 'password123',
    role: 'turf',
    profileCompleted: true,
    turf_name: 'Malviya Nagar Sports Complex',
    turf_address: 'Malviya Nagar, Jaipur, Rajasthan',
    pin_code: '302017',
    available_sports: ['Cricket', 'Football', 'Badminton']
  },
  {
    firstName: 'Turf',
    lastName: 'Owner26',
    email: 'turf.vaishali@sportconnect.com',
    phone: '9123456805',
    password: 'password123',
    role: 'turf',
    profileCompleted: true,
    turf_name: 'Vaishali Sports Arena',
    turf_address: 'Vaishali Nagar, Jaipur, Rajasthan',
    pin_code: '302021',
    available_sports: ['Football', 'Tennis', 'Basketball']
  },

  // AHMEDABAD TURFS
  {
    firstName: 'Turf',
    lastName: 'Owner27',
    email: 'turf.satellite@sportconnect.com',
    phone: '9123456806',
    password: 'password123',
    role: 'turf',
    profileCompleted: true,
    turf_name: 'Satellite Sports Hub',
    turf_address: 'Satellite, Ahmedabad, Gujarat',
    pin_code: '380015',
    available_sports: ['Cricket', 'Football', 'Badminton']
  },
  {
    firstName: 'Turf',
    lastName: 'Owner28',
    email: 'turf.bodakdev@sportconnect.com',
    phone: '9123456807',
    password: 'password123',
    role: 'turf',
    profileCompleted: true,
    turf_name: 'Bodakdev Sports Complex',
    turf_address: 'Bodakdev, Ahmedabad, Gujarat',
    pin_code: '380054',
    available_sports: ['Tennis', 'Basketball', 'Volleyball']
  },

  // BHIMAVARAM TURFS (LOCAL)
  {
    firstName: 'Turf',
    lastName: 'Owner29',
    email: 'turf.elitesports@sportconnect.com',
    phone: '9123456808',
    password: 'password123',
    role: 'turf',
    profileCompleted: true,
    turf_name: 'Elite Sports Arena',
    turf_address: 'Youth Club Road, Bhimavaram, Andhra Pradesh',
    pin_code: '534202',
    available_sports: ['Badminton', 'Cricket', 'Volleyball', 'Football']
  },
  {
    firstName: 'Turf',
    lastName: 'Owner30',
    email: 'turf.probadminton@sportconnect.com',
    phone: '9123456809',
    password: 'password123',
    role: 'turf',
    profileCompleted: true,
    turf_name: 'PRO Badminton Academy',
    turf_address: 'Opp Bhavans Road, Bhimavaram, Andhra Pradesh',
    pin_code: '534202',
    available_sports: ['Badminton']
  },
  {
    firstName: 'Turf',
    lastName: 'Owner31',
    email: 'turf.dnrground@sportconnect.com',
    phone: '9123456810',
    password: 'password123',
    role: 'turf',
    profileCompleted: true,
    turf_name: 'DNR Ground',
    turf_address: 'GGP9+X2V, Bhimavaram, Andhra Pradesh',
    pin_code: '534202',
    available_sports: ['Cricket', 'Basketball', 'Volleyball']
  },
  {
    firstName: 'Turf',
    lastName: 'Owner32',
    email: 'turf.srkrsports@sportconnect.com',
    phone: '9123456811',
    password: 'password123',
    role: 'turf',
    profileCompleted: true,
    turf_name: 'SRKR Sports Complex',
    turf_address: 'SRKR Engineering College, BHEL Road, Bhimavaram',
    pin_code: '534204',
    available_sports: ['Cricket', 'Football', 'Basketball', 'Volleyball']
  },
  {
    firstName: 'Turf',
    lastName: 'Owner33',
    email: 'turf.bhimavaram@sportconnect.com',
    phone: '9123456812',
    password: 'password123',
    role: 'turf',
    profileCompleted: true,
    turf_name: 'Bhimavaram Sports Hub',
    turf_address: 'Main Road, Bhimavaram, Andhra Pradesh',
    pin_code: '534201',
    available_sports: ['Football', 'Cricket', 'Tennis', 'Badminton']
  }
];

const seedTurfs = [
  {
    turfName: 'Champions Ground',
    location: 'Andheri, Mumbai',
    pricePerHour: 1500,
    availableSports: ['Football', 'Cricket'],
    amenities: ['Parking', 'Changing Rooms', 'Floodlights'],
    images: []
  },
  {
    turfName: 'Victory Sports Complex',
    location: 'Bandra, Mumbai',
    pricePerHour: 2000,
    availableSports: ['Football', 'Basketball', 'Badminton'],
    amenities: ['Parking', 'Cafeteria', 'Changing Rooms', 'First Aid'],
    images: []
  }
];

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany();
    await Turf.deleteMany();
    await Booking.deleteMany();

    console.log('Data cleared');

    // Create users
    const createdUsers = await User.create(seedUsers);
    console.log('Users seeded');

    // Create turfs with turf owner
    const turfOwner = createdUsers.find(u => u.role === 'turf');
    const turfsWithOwner = seedTurfs.map(turf => ({
      ...turf,
      owner: turfOwner._id
    }));

    await Turf.create(turfsWithOwner);
    console.log('Turfs seeded');

    console.log('✅ Database seeded successfully!');
    console.log('\nTest Credentials:');
    console.log('Player: player@test.com / password123');
    console.log('Coach: coach@test.com / password123');
    console.log('Turf: turf@test.com / password123');

    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();

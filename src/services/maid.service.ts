import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, delay } from 'rxjs/operators';
import { Maid, MaidSearchFilters } from '../models';

@Injectable({
  providedIn: 'root'
})
export class MaidService {
  private readonly mockMaids: Maid[] = this.generateMockMaids();

  getAllMaids(): Observable<Maid[]> {
    return of(this.mockMaids).pipe(delay(200));
  }

  getMaidById(id: number): Observable<Maid> {
    return of(this.mockMaids.find(m => m.id === id) as Maid).pipe(delay(200));
  }

  searchMaids(filters: MaidSearchFilters): Observable<Maid[]> {
    return of(this.mockMaids).pipe(
      map(maids => maids.filter(m => this.matchesFilters(m, filters))),
      delay(250)
    );
  }

  getMaids(): Observable<Maid[]> {
    return of(this.mockMaids).pipe(delay(200));
  }

  getFeaturedMaids(): Observable<Maid[]> {
    return of(this.mockMaids.filter(m => m.rating >= 4.5).slice(0, 9)).pipe(delay(200));
  }

  getMaidsByLocation(city: string, country: string): Observable<Maid[]> {
    return of(this.mockMaids.filter(m => m.location.city === city && m.location.country === country)).pipe(delay(200));
  }

  createMaidProfile(maidData: Partial<Maid>): Observable<Maid> {
    const newMaid: Maid = {
      ...(maidData as Maid),
      id: this.mockMaids.length + 1,
      userId: this.mockMaids.length + 1000,
      createdAt: new Date(),
      updatedAt: new Date(),
      isVerified: !!maidData.isVerified,
      totalReviews: maidData.totalReviews ?? 0,
      rating: maidData.rating ?? 0,
      workHistory: maidData.workHistory ?? [],
      certifications: maidData.certifications ?? [],
      references: maidData.references ?? []
    };
    this.mockMaids.unshift(newMaid);
    return of(newMaid).pipe(delay(200));
  }

  updateMaidProfile(id: number, maidData: Partial<Maid>): Observable<Maid> {
    const index = this.mockMaids.findIndex(m => m.id === id);
    this.mockMaids[index] = { ...this.mockMaids[index], ...maidData, updatedAt: new Date() } as Maid;
    return of(this.mockMaids[index]).pipe(delay(200));
  }

  deleteMaidProfile(id: number): Observable<void> {
    const index = this.mockMaids.findIndex(m => m.id === id);
    if (index >= 0) this.mockMaids.splice(index, 1);
    return of(void 0).pipe(delay(200));
  }

  getMaidReviews(maidId: number): Observable<any[]> {
    return of([
      { id: 1, user: 'Ali', rating: 5, comment: 'Excellent help!', date: new Date() },
      { id: 2, user: 'Fatima', rating: 4, comment: 'Very reliable.', date: new Date() }
    ]).pipe(delay(200));
  }

  addMaidReview(maidId: number, reviewData: { rating: number; comment: string; }): Observable<any> {
    return of({ id: Math.random(), maidId, ...reviewData, date: new Date() }).pipe(delay(200));
  }

  getAvailableSkills(): Observable<string[]> {
    return of(['Cleaning', 'Cooking', 'Childcare', 'Elderly Care', 'Pet Care', 'Driving']).pipe(delay(100));
  }

  getAvailableNationalities(): Observable<string[]> {
    return of(['Filipino', 'Indian', 'Sri Lankan', 'Indonesian', 'Ethiopian', 'Nepalese']).pipe(delay(100));
  }

  getAvailableLanguages(): Observable<string[]> {
    return of(['English', 'Arabic', 'Hindi', 'Tagalog', 'Urdu']).pipe(delay(100));
  }

  toggleMaidAvailability(maidId: number, availability: 'available' | 'busy' | 'unavailable'): Observable<Maid> {
    return this.updateMaidProfile(maidId, { availability });
  }

  private matchesFilters(maid: Maid, filters: MaidSearchFilters): boolean {
    const byNationality = !filters.nationality || maid.nationality === filters.nationality;
    const bySkills = !filters.skills || filters.skills.every(s => maid.skills.includes(s));
    const byExperience = !filters.minExperience || maid.experience >= filters.minExperience;
    const byRate = !filters.maxHourlyRate || maid.hourlyRate <= filters.maxHourlyRate;
    const byAvailability = !filters.availability || maid.availability === filters.availability;
    const byLanguages = !filters.languages || filters.languages.every(l => maid.languages.includes(l));
    const byVerified = filters.isVerified === undefined || maid.isVerified === filters.isVerified;
    const byRating = !filters.minRating || maid.rating >= filters.minRating;
    const byLocation = !filters.location || maid.location.city.toLowerCase().includes(filters.location.toLowerCase());
    return byNationality && bySkills && byExperience && byRate && byAvailability && byLanguages && byVerified && byRating && byLocation;
  }

  private getMaidPhoto(index: number): string {
    const photos = [
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face'
    ];
    return photos[index % photos.length];
  }

  private getMaidBio(nationality: string, index: number): string {
    const bios = [
      `Experienced ${nationality} domestic helper with excellent references. Specializes in housekeeping, cooking, and childcare.`,
      `Professional ${nationality} maid with ${index} years of experience in UAE. Trustworthy, reliable, and hardworking.`,
      `Skilled ${nationality} domestic worker with expertise in cleaning, cooking, and elderly care. Available immediately.`,
      `Dedicated ${nationality} helper with proven track record. Excellent with children and pets. Fluent in English and Arabic.`,
      `Reliable ${nationality} maid with strong work ethic. Specializes in deep cleaning, meal preparation, and laundry.`
    ];
    return bios[index % bios.length];
  }

  private getWorkHistory(index: number): any[] {
    const histories = [
      { company: 'Private Family', position: 'Domestic Helper', duration: '2 years', location: 'Dubai' },
      { company: 'VIP Household', position: 'Housekeeper', duration: '1.5 years', location: 'Abu Dhabi' },
      { company: 'Family Residence', position: 'Nanny & Cook', duration: '3 years', location: 'Sharjah' }
    ];
    return histories.slice(0, 1 + (index % 3));
  }

  private getCertifications(index: number): any[] {
    const certs = [
      { name: 'First Aid Certificate', issuer: 'Red Cross', year: '2023' },
      { name: 'Childcare Training', issuer: 'UAE Ministry', year: '2022' },
      { name: 'Food Safety Certificate', issuer: 'Dubai Municipality', year: '2023' },
      { name: 'Housekeeping Diploma', issuer: 'Professional Institute', year: '2022' }
    ];
    return certs.slice(0, 1 + (index % 3));
  }

  private getReferences(index: number): any[] {
    const refs = [
      { name: 'Mrs. Sarah Ahmed', phone: '+971 50 123 4567', relationship: 'Previous Employer' },
      { name: 'Mr. Ali Hassan', phone: '+971 55 987 6543', relationship: 'Family Friend' },
      { name: 'Ms. Fatima Al-Rashid', phone: '+971 52 456 7890', relationship: 'Former Client' }
    ];
    return refs.slice(0, 1 + (index % 2));
  }

  private generateMockMaids(): Maid[] {
    const cities = ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Al Ain', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain'];
    const countries = ['UAE'];
    const nationalities = ['Filipino', 'Indian', 'Sri Lankan', 'Indonesian', 'Ethiopian', 'Nepalese', 'Bangladeshi', 'Pakistani', 'Kenyan', 'Ugandan'];
    const skillsPool = ['House Cleaning', 'Cooking', 'Childcare', 'Elderly Care', 'Pet Care', 'Driving', 'Laundry', 'First Aid', 'Ironing', 'Grocery Shopping', 'Gardening', 'Baby Care', 'House Management', 'Meal Planning', 'Deep Cleaning'];
    const languagesPool = ['English', 'Arabic', 'Hindi', 'Tagalog', 'Urdu', 'Bengali', 'Swahili', 'French', 'Spanish', 'Mandarin'];
    
    // Enhanced static maid data with realistic names and details
    const maidNames = [
      { first: 'Maria', last: 'Santos' },
      { first: 'Priya', last: 'Sharma' },
      { first: 'Siti', last: 'Nurhaliza' },
      { first: 'Fatima', last: 'Al-Zahra' },
      { first: 'Grace', last: 'Okafor' },
      { first: 'Aisha', last: 'Hassan' },
      { first: 'Lakshmi', last: 'Devi' },
      { first: 'Rosa', last: 'Garcia' },
      { first: 'Nur', last: 'Aini' },
      { first: 'Sarah', last: 'Johnson' },
      { first: 'Mei', last: 'Chen' },
      { first: 'Amara', last: 'Singh' },
      { first: 'Elena', last: 'Rodriguez' },
      { first: 'Zara', last: 'Ahmed' },
      { first: 'Luna', last: 'Fernandez' },
      { first: 'Kiran', last: 'Patel' },
      { first: 'Sofia', last: 'Martinez' },
      { first: 'Amina', last: 'Ibrahim' },
      { first: 'Isabella', last: 'Silva' },
      { first: 'Nadia', last: 'Khan' },
      { first: 'Carmen', last: 'Lopez' },
      { first: 'Rita', last: 'Fernandes' },
      { first: 'Lina', last: 'Mahmoud' },
      { first: 'Eva', last: 'Kowalski' },
      { first: 'Maya', last: 'Patel' },
      { first: 'Carla', last: 'Silva' },
      { first: 'Nina', last: 'Kumar' },
      { first: 'Rosa', last: 'Gonzalez' },
      { first: 'Lily', last: 'Wang' },
      { first: 'Anna', last: 'Kowalski' },
      { first: 'Diana', last: 'Ross' },
      { first: 'Elena', last: 'Vasquez' },
      { first: 'Fiona', last: 'O\'Connor' },
      { first: 'Gina', last: 'Martinez' },
      { first: 'Hana', last: 'Kim' },
      { first: 'Iris', last: 'Johnson' },
      { first: 'Julia', last: 'Brown' },
      { first: 'Kara', last: 'Davis' },
      { first: 'Lara', last: 'Wilson' },
      { first: 'Mara', last: 'Moore' },
      { first: 'Nora', last: 'Taylor' },
      { first: 'Ora', last: 'Anderson' },
      { first: 'Pam', last: 'Thomas' },
      { first: 'Rita', last: 'Jackson' },
      { first: 'Sara', last: 'White' },
      { first: 'Tara', last: 'Harris' },
      { first: 'Vera', last: 'Martin' },
      { first: 'Wanda', last: 'Thompson' },
      { first: 'Yara', last: 'Garcia' },
      { first: 'Zara', last: 'Martinez' }
    ];

    const mock: Maid[] = [];
    for (let i = 1; i <= 100; i++) {
      const nameIndex = (i - 1) % maidNames.length;
      const nationality = nationalities[i % nationalities.length];
      const city = cities[i % cities.length];
      const skillCount = 3 + (i % 4);
      const langsCount = 1 + (i % 3);
      
      // More realistic hourly rates based on experience and skills
      const baseRate = 15 + (i % 15);
      const experienceBonus = Math.floor(i / 10) * 5;
      const skillBonus = skillCount > 5 ? 5 : 0;
      const hourlyRate = baseRate + experienceBonus + skillBonus;
      
      mock.push({
        id: i,
        userId: 1000 + i,
        firstName: maidNames[nameIndex].first,
        lastName: maidNames[nameIndex].last,
        age: 20 + (i % 25),
        nationality,
        experience: 1 + (i % 15),
        languages: languagesPool.slice(0, langsCount),
        skills: skillsPool.slice(0, skillCount),
        availability: (['available', 'busy', 'unavailable'] as const)[i % 3],
        hourlyRate,
        profileImage: this.getMaidPhoto(i),
        bio: this.getMaidBio(nationality, i),
        location: { 
          city, 
          country: countries[0], 
          address: this.getRandomAddress(city, i) 
        },
        workHistory: this.getWorkHistory(i),
        certifications: this.getCertifications(i),
        references: this.getReferences(i),
        isVerified: i % 3 === 0 || i % 5 === 0,
        rating: 3.5 + (i % 2) + (i % 3 === 0 ? 0.5 : 0),
        totalReviews: 3 + (i % 60),
        createdAt: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)),
        updatedAt: new Date()
      });
    }
    return mock;
  }

  private getRandomAddress(city: string, index: number): string {
    const areas = {
      'Dubai': ['Marina', 'Downtown', 'Jumeirah', 'Deira', 'Bur Dubai', 'Mirdif', 'JBR', 'Palm Jumeirah'],
      'Abu Dhabi': ['Al Reem Island', 'Corniche', 'Al Khalidiyah', 'Al Zahiyah', 'Al Markaziyah', 'Al Mushrif'],
      'Sharjah': ['Al Majaz', 'Al Qasba', 'Al Khan', 'Al Rolla', 'Al Nahda', 'Al Taawun'],
      'Ajman': ['Al Nuaimiya', 'Al Rashidiya', 'Al Rawda', 'Al Jerf', 'Al Mowaihat'],
      'Al Ain': ['Al Jimi', 'Al Qattara', 'Al Mutawaa', 'Al Foah', 'Al Hili'],
      'Ras Al Khaimah': ['Al Qawasim', 'Al Nakheel', 'Al Hamra', 'Al Marjan Island'],
      'Fujairah': ['Downtown', 'Al Faseel', 'Al Gurfa', 'Al Aqah'],
      'Umm Al Quwain': ['Al Salamah', 'Al Haditha', 'Al Qawasim', 'Al Siniyah']
    };
    
    const cityAreas = areas[city as keyof typeof areas] || ['Downtown', 'Central', 'Main'];
    const area = cityAreas[index % cityAreas.length];
    const streetNumber = 100 + (index % 900);
    
    return `${streetNumber} ${area} Street, ${area}, ${city}`;
  }
}

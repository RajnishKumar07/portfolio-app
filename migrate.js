const fs = require('fs');
const { execSync } = require('child_process');

try {
  let rawData = fs.readFileSync('old_resume.ts', 'utf-8');
  
  // Strip out all the TS interfaces to make it valid JS
  let jsData = rawData
    .replace(/export interface[\s\S]*?}\n/g, '') // remove interfaces
    .replace(/export const portfolioData: PortfolioData =/g, 'module.exports.portfolioData =')
    .replace(/as [a-zA-Z\[\]]+/g, '') // remove "as Type[]"
    .replace(/export const portfolioData =/g, 'module.exports.portfolioData =');

  fs.writeFileSync('temp_data.js', jsData);
  
  const { portfolioData } = require('./temp_data.js');
  
  console.log("Extracted Portfolio Data for:", portfolioData.personal.name);

  // Login to API to get secure Auth Cookie
  fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'rajnish@test.com', password: 'password123' })
  }).then(async r => {
    const cookie = r.headers.get('set-cookie');
    
    // Construct exact payload from static
    const payload = {
      slug: 'rajnish-kumar',
      isPublic: true,
      personalInfo: {
        name: portfolioData.personal.name,
        title: portfolioData.personal.title,
        about: portfolioData.personal.summary,
        email: portfolioData.personal.email,
        phone: portfolioData.personal.phone,
        location: portfolioData.personal.location,
        githubUrl: portfolioData.personal.github,
        linkedinUrl: portfolioData.personal.linkedin
      },
      experiences: portfolioData.experience.map(e => ({
        role: e.role,
        company: e.company,
        period: e.period,
        location: e.location,
        description: e.description || '',
        responsibilities: e.responsibilities || [],
        projects: e.projects || [],
        recognition: e.recognition || null
      })),
      educations: portfolioData.education.map(e => ({
        degree: e.degree,
        institution: e.institution,
        period: e.period,
        description: e.description || ''
      })),
      projects: portfolioData.projects.map(p => ({
        title: p.title,
        description: p.description,
        link: p.link || null,
        imagePath: p.imagePath || null,
        tags: p.tags || []
      })),
      skills: portfolioData.skills.map(s => ({
        category: s.category,
        items: s.items || []
      }))
    };
    
    console.log("Sending precise static payload to NestJS backend...");
    const pRes = await fetch('http://localhost:3000/api/portfolio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Cookie': cookie },
      body: JSON.stringify(payload)
    });
    
    const pJson = await pRes.json();
    if(pRes.ok) {
        console.log("Successfully seeded full portfolio database!");
    } else {
        console.error("Failed:", pJson);
    }
    
  }).catch(console.error);

} catch (err) {
  console.error("Migration script failed:", err);
}

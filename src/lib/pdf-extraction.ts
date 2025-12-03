// PDF text extraction utility using PDF.js
// This would typically be used in a browser environment
// For server-side extraction, you might want to use pdf-parse or similar

export interface ExtractedText {
  text: string;
  pages: Array<{
    pageNumber: number;
    text: string;
  }>;
  metadata?: {
    title?: string;
    author?: string;
    subject?: string;
    creator?: string;
    producer?: string;
    creationDate?: Date;
    modificationDate?: Date;
  };
}

/**
 * Extract text from PDF file using PDF.js in browser environment
 * Note: This requires PDF.js to be loaded and is client-side only
 */
export async function extractTextFromPDF(file: File): Promise<ExtractedText> {
  return new Promise((resolve, reject) => {
    try {
      // Check if PDF.js is available
      if (typeof window === 'undefined' || !(window as any).pdfjsLib) {
        throw new Error('PDF.js library not loaded. Please include PDF.js script.');
      }

      // Read file as ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();
      
      // Load PDF document
      const loadingTask = (window as any).pdfjsLib.getDocument({
        data: arrayBuffer,
      });

      const pdf = await loadingTask.promise;
      
      // Extract text from all pages
      const numPages = pdf.numPages;
      const pages: ExtractedText['pages'] = [];
      
      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        
        pages.push({
          pageNumber: pageNum,
          text: textContent.items.map((item: any) => item.str).join(' '),
        });
      }

      // Get metadata
      const metadata = await pdf.getMetadata();
      
      resolve({
        text: pages.map(page => page.text).join('\n\n'),
        pages,
        metadata: {
          title: metadata.info?.Title,
          author: metadata.info?.Author,
          subject: metadata.info?.Subject,
          creator: metadata.info?.Creator,
          producer: metadata.info?.Producer,
          creationDate: metadata.info?.CreationDate ? new Date(metadata.info.CreationDate) : undefined,
          modificationDate: metadata.info?.ModDate ? new Date(metadata.info.ModDate) : undefined,
        },
      });
    } catch (error) {
      reject(new Error(`PDF extraction failed: ${error instanceof Error ? error.message : 'Unknown error'}`));
    }
  });
}

/**
 * Server-side PDF extraction using pdf-parse (alternative approach)
 * This would be used in a Node.js environment
 */
export async function extractTextFromPDFServer(pdfBuffer: Buffer): Promise<ExtractedText> {
  try {
    // Dynamic import for server-side
    const pdfParse = await import('pdf-parse');
    
    const data = await pdfParse.default(pdfBuffer);
    
    return {
      text: data.text || '',
      pages: [], // pdf-parse doesn't provide page-by-page text
      metadata: {
        title: data.info?.Title,
        author: data.info?.Author,
        subject: data.info?.Subject,
        creator: data.info?.Creator,
        producer: data.info?.Producer,
        creationDate: data.info?.CreationDate ? new Date(data.info.CreationDate) : undefined,
        modificationDate: data.info?.ModDate ? new Date(data.info.ModDate) : undefined,
      },
    };
  } catch (error) {
    throw new Error(`PDF extraction failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Extract text from PDF URL
 * Fetches PDF from URL and extracts text
 */
export async function extractTextFromPDFUrl(url: string): Promise<ExtractedText> {
  try {
    // Fetch PDF from URL
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch PDF: ${response.statusText}`);
    }
    
    const arrayBuffer = await response.arrayBuffer();
    
    // Determine if we're in browser or server environment
    if (typeof window !== 'undefined') {
      return await extractTextFromPDF(new File([arrayBuffer], 'resume.pdf', { type: 'application/pdf' }));
    } else {
      return await extractTextFromPDFServer(Buffer.from(arrayBuffer));
    }
  } catch (error) {
    throw new Error(`PDF URL extraction failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Extract key skills from resume text
 * Simple keyword extraction for technical skills
 */
export function extractSkills(text: string): string[] {
  // Common technical skills to look for
  const technicalSkills = [
    'javascript', 'typescript', 'react', 'vue', 'angular', 'node.js', 'express',
    'python', 'django', 'flask', 'fastapi', 'java', 'spring', 'hibernate',
    'c#', '.net', 'asp.net', 'sql', 'mongodb', 'postgresql', 'mysql',
    'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins', 'git',
    'html', 'css', 'sass', 'tailwind', 'bootstrap', 'webpack', 'vite',
    'rest api', 'graphql', 'microservices', 'agile', 'scrum', 'devops',
    'linux', 'ubuntu', 'windows', 'macos', 'bash', 'powershell',
    'testing', 'jest', 'cypress', 'selenium', 'ci/cd',
    'machine learning', 'tensorflow', 'pytorch', 'scikit-learn', 'nlp',
    'blockchain', 'web3', 'solidity', 'smart contracts',
    'mobile', 'ios', 'android', 'react native', 'flutter', 'swift', 'kotlin',
    'data structures', 'algorithms', 'oop', 'design patterns',
    'security', 'authentication', 'authorization', 'oauth', 'jwt', 'encryption',
    'performance', 'optimization', 'caching', 'load balancing',
    'monitoring', 'logging', 'metrics', 'analytics', 'prometheus', 'grafana'
  ];

  const lowerText = text.toLowerCase();
  const foundSkills: string[] = [];

  // Look for exact matches
  technicalSkills.forEach(skill => {
    if (lowerText.includes(skill.toLowerCase())) {
      foundSkills.push(skill);
    }
  });

  // Look for partial matches and variations
  const skillVariations = {
    'javascript': ['js', 'javascript', 'ecmascript'],
    'typescript': ['ts', 'typescript'],
    'react': ['react', 'reactjs', 'react.js'],
    'node.js': ['node', 'nodejs', 'node.js'],
    'python': ['python', 'py'],
    'sql': ['sql', 'mysql', 'postgresql', 'mongodb'],
    'aws': ['aws', 'amazon web services', 'ec2', 's3'],
    'docker': ['docker', 'containers'],
  };

  Object.entries(skillVariations).forEach(([mainSkill, variations]) => {
    variations.forEach(variation => {
      if (lowerText.includes(variation) && !foundSkills.includes(mainSkill)) {
        foundSkills.push(mainSkill);
      }
    });
  });

  return [...new Set(foundSkills)]; // Remove duplicates
}

/**
 * Extract experience information from resume text
 */
export function extractExperience(text: string): Array<{
  company?: string;
  position?: string;
  duration?: string;
  years?: number;
}> {
  const experiences: Array<{
    company?: string;
    position?: string;
    duration?: string;
    years?: number;
  }> = [];

  const lines = text.split('\n');
  
  // Look for patterns like "X years at Company" or "Company Name - Position (Year)"
  const experiencePatterns = [
    /(\d+)\s*(?:years?|yrs?)\s*(?:at|@)\s*([A-Za-z0-9\s&]+)/gi,
    /([A-Za-z0-9\s&]+)\s*[-–—]\s*([A-Za-z0-9\s&]+)\s*\((\d{4})\s*[-–—]?\s*(?:\d{4}|present))/gi,
    /([A-Za-z0-9\s&]+)\s*\|\s*([A-Za-z0-9\s&]+)\s*\|\s*(\d{4})\s*[-–—]?\s*(?:\d{4}|present)/gi,
  ];

  experiencePatterns.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) {
      experiences.push({
        company: matches[2]?.trim(),
        position: matches[1]?.trim(),
        duration: matches[0]?.trim(),
        years: parseInt(matches[3]) || undefined,
      });
    }
  });

  return experiences;
}

/**
 * Extract education information from resume text
 */
export function extractEducation(text: string): Array<{
  school?: string;
  degree?: string;
  field?: string;
  year?: number;
}> {
  const education: Array<{
    school?: string;
    degree?: string;
    field?: string;
    year?: number;
  }> = [];

  // Look for degree patterns
  const degreePatterns = [
    /(?:bachelor|master|phd|associate|b\.s\.|m\.s\.|ph\.d\.?)\s*(?:degree|'s)?\s*(?:in|of)\s*([a-z\s&]+)/gi,
    /university\s*of\s*([a-z\s&]+)/gi,
    /([a-z\s&]+)\s*(?:university|college|institute)/gi,
  ];

  degreePatterns.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) {
      education.push({
        school: matches[2]?.trim(),
        degree: matches[1]?.trim(),
        field: matches[1]?.trim(),
      });
    }
  });

  // Look for year patterns
  const yearPattern = /\b(19|20)\d{2}\b/g;
  const yearMatches = text.match(yearPattern);
  if (yearMatches) {
    const years = yearMatches.map(year => parseInt(year));
    education.forEach((edu, index) => {
      if (years[index]) {
        edu.year = years[index];
      }
    });
  }

  return education;
}

/**
 * Clean and normalize extracted text
 */
export function cleanExtractedText(text: string): string {
  return text
    // Remove extra whitespace
    .replace(/\s+/g, ' ')
    // Remove special characters that might cause issues
    .replace(/[^\w\s\.\-\,\n\r]/g, '')
    // Normalize line breaks
    .replace(/\r\n/g, '\n')
    .trim();
}

## **Phase 1: Project Setup and Initial Configuration**

### **1. Core Objectives**

- **Programmatic SEO:** Build a fully programmatic SEO-friendly website focusing on wedding vendors in United States.
- **Dynamic Content Generation:** Utilize lists of trades, counties, and towns to generate dynamic paths and pages.
- **Static and Dynamic Content Mix:** Incorporate substantial static content at build time while fetching and caching dynamic content on-demand.

### **2. Initial Setup**

- **Development Environment**
  - Install **Node.js** and a code editor like **Visual Studio Code**.
  - Initialize a new **Next.js** project with **TypeScript** support.
    ```bash
    npx create-next-app@latest find-a-tradesperson-ireland --typescript
    cd find-a-tradesperson-ireland
    ```

- **Version Control**
  - Initialize a **Git** repository.
    ```bash
    git init
    git add .
    git commit -m "Initial commit"
    ```
  - Create a `.gitignore` file to exclude `node_modules`, `.env.local`, and other unnecessary files.

- **Code Quality Tools**
  - Install and configure **ESLint** and **Prettier**.
    ```bash
    npm install eslint prettier eslint-config-prettier eslint-plugin-prettier --save-dev
    npx eslint --init
    ```
  - Configure `.eslintrc.js` and `.prettierrc` for consistent code style.

### **3. Install Required Libraries**

- **Styling**
  - Install **Tailwind CSS** for utility-first CSS styling.
    ```bash
    npm install tailwindcss postcss autoprefixer
    npx tailwindcss init -p
    ```
  - Configure `tailwind.config.js` to include paths to all your pages and components.

- **UI Components**
  - Install **shadcn/ui components** for accessible and reusable UI elements.
    ```bash
    npx shadcn-ui init
    ```
  - Follow the prompts to set up the components.

- **Icons**
  - Install **Lucide Icons** for consistent iconography.
    ```bash
    npm install lucide-react
    ```

- **Data Fetching**
  - Install **Axios** for handling HTTP requests.
    ```bash
    npm install axios
    ```

### **4. Static Data Preparation**

- **Data Files**
  - Create a `data` directory to store your static JSON files.
    - **`data/counties.json`**: List of counties and their towns in Ireland.
    - **`data/trades.json`**: List of trades (e.g., plumbers, electricians, carpenters).
- **Purpose**
  - These files will be used to programmatically generate all possible combinations of trades in various locations without hardcoding.

### **5. Environment Variables**

- **Secure Configuration**
  - Create a `.env.local` file to store environment-specific variables.
    ```env
    DATAFORSEO_USERNAME=your_username
    DATAFORSEO_PASSWORD=your_password
    ```
  - **Note:** Ensure this file is included in your `.gitignore` to prevent sensitive data from being committed.

---

## **Phase 2: UI/UX Foundation**

### **6. Design Layout Components**

- **Header and Footer**
  - Use **shadcn/ui components** to create consistent `Header` and `Footer` components.
  - Include navigation links to main sections: Home, Trades, Counties, Contact.

- **Main Layout**
  - Create a `MainLayout` component to wrap pages with the header and footer.
    ```jsx
    // components/MainLayout.tsx
    const MainLayout = ({ children }) => (
      <>
        <Header />
        <main>{children}</main>
        <Footer />
      </>
    );
    export default MainLayout;
    ```

- **Navigation**
  - Implement a responsive navigation menu.
  - Use **Lucide Icons** for visual enhancements.

### **7. Implement Reusable UI Components**

- **Cards**
  - Create `TradeCard`, `CountyCard`, and `TradespersonCard` components.
  - Use Tailwind CSS and **shadcn/ui** for styling.

- **Buttons**
  - Standardize button styles using **shadcn/ui** components.

- **Breadcrumbs**
  - Implement breadcrumbs for better navigation and SEO.

---

## **Phase 3: Dynamic Routing and API Integration**

### **8. Dynamic Routing with Fallback**

#### **8.1 Implement Dynamic Routes**

- **Create Dynamic Pages**
  - Set up dynamic routes for trades in locations:
    ```
    pages/
      [tradeSlug]/
        [countySlug]/
          [townSlug]/
            index.tsx
    ```

- **Configure `getStaticPaths` with Fallback**
  ```typescript
  // pages/[tradeSlug]/[countySlug]/[townSlug]/index.tsx
  export const getStaticPaths: GetStaticPaths = async () => {
    return {
      paths: [], // No pages pre-rendered at build time
      fallback: 'blocking', // Pages will be generated on-demand
    };
  };
  ```

### **9. API Integration with DataForSEO**

#### **9.1 Set Up API Service**

- **Create API Utility Functions**
  ```typescript
  // services/dataForSeo.ts
  import axios from 'axios';

  const auth = Buffer.from(`${process.env.DATAFORSEO_USERNAME}:${process.env.DATAFORSEO_PASSWORD}`).toString('base64');

  export const fetchTradespeople = async (keyword: string) => {
    try {
      const response = await axios.post(
        'https://api.dataforseo.com/v3/serp/google/maps/live/advanced',
        [{ keyword, location_code: 2372, language_code: 'us', device: 'desktop', os: 'windows', depth: 100 }],
        { headers: { Authorization: `Basic ${auth}` } }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching tradespeople:', error);
      return null;
    }
  };
  ```

#### **9.2 Implement Error Handling**

- **Handle API Errors in `getStaticProps`**
  ```typescript
  // pages/[tradeSlug]/[countySlug]/[townSlug]/index.tsx
  export const getStaticProps: GetStaticProps = async (context) => {
    const { tradeSlug, townSlug } = context.params;

    // Fetch data
    const data = await fetchTradespeople(`${tradeSlug} in ${townSlug}`);

    if (!data) {
      return { notFound: true };
    }

    return {
      props: {
        tradespeople: data.result[0]?.items || [],
        tradeSlug,
        townSlug,
      },
      revalidate: false, // Cache indefinitely
    };
  };
  ```

### **10. Implement Incremental Static Regeneration (ISR)**

#### **10.1 Enable ISR in `getStaticProps`**

- **Set Revalidation Time**
  ```typescript
  export const getStaticProps: GetStaticProps = async (context) => {
    // ...existing code...

    return {
      props: {
        // ...props
      },
      revalidate: 86400, // Revalidate every 24 hours
    };
  };
  ```
- **Benefits**
  - Keeps content fresh without rebuilding the entire site.
  - Balances performance and data freshness.

---

## **Phase 4: Page Development**

### **11. Build Page Types**

#### **11.1 Homepage**

- **Features**
  - Introduction to the site.
  - Quick links to popular trades, counties, and towns.
  - Include a search bar for users to find tradespeople.

#### **11.2 Trade Pages**

- **Path**
  - `pages/[tradeSlug]/index.tsx`
- **Content**
  - List all counties where the trade is available.
  - Brief description of the trade.
- **SEO**
  - Title: `Find the Best [Trade] in Ireland`
  - Meta Description: `Discover top-rated [trade] across Ireland. Browse by county and town.`

#### **11.3 County Pages**

- **Path**
  - `pages/[tradeSlug]/[countySlug]/index.tsx`
- **Content**
  - List all towns in the county with available tradespeople.
- **SEO**
  - Title: `Top [Trade] in [County]`
  - Meta Description: `Find experienced [trade] in [County], Ireland. Contact professionals near you.`

#### **11.4 Town Pages**

- **Path**
  - `pages/[tradeSlug]/[countySlug]/[townSlug]/index.tsx`
- **Content**
  - List all tradespeople in the town for the selected trade.
- **SEO**
  - Title: `Best [Trade] in [Town], [County]`
  - Meta Description: `Looking for [trade] in [Town]? Read reviews and contact the best professionals today.`

#### **11.5 Tradesperson Pages**

- **Path**
  - `pages/tradesperson/[tradespersonId].tsx`
- **Content**
  - Detailed information about the tradesperson.
  - Include services offered, contact information, reviews, and ratings.
- **SEO**
  - Title: `[Business Name] - [Trade] in [Town], [County]`
  - Meta Description: `Learn about [Business Name], a reputable [trade] in [Town], [County]. See reviews and contact details.`

---

## **Phase 5: SEO Optimization**

### **12. Optimize Meta Tags and Descriptions**

#### **12.1 Dynamic SEO Metadata**

- **Use `next/head` for Meta Tags**
  ```jsx
  import Head from 'next/head';

  const Page = ({ trade, town, county }) => (
    <>
      <Head>
        <title>Best {trade} in {town}, {county} - Contact Today</title>
        <meta
          name="description"
          content={`Find top-rated ${trade} in ${town}, ${county}. Read reviews and get in touch with professionals now.`}
        />
      </Head>
      {/* Page Content */}
    </>
  );
  ```

### **13. Implement Structured Data**

#### **13.1 Add JSON-LD Structured Data**

- **Enhance Search Visibility**
  ```jsx
  import Head from 'next/head';

  const TradespersonPage = ({ tradesperson }) => {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": tradesperson.name,
      "image": tradesperson.image,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": tradesperson.address,
        "addressLocality": tradesperson.town,
        "addressRegion": tradesperson.county,
        "postalCode": tradesperson.postalCode,
        "addressCountry": "IE"
      },
      "telephone": tradesperson.phone,
      "url": `https://findatradespersonireland.com/tradesperson/${tradesperson.id}`,
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": tradesperson.rating,
        "reviewCount": tradesperson.reviewCount
      }
    };

    return (
      <>
        <Head>
          {/* Other meta tags */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
          />
        </Head>
        {/* Page Content */}
      </>
    );
  };
  ```

### **14. Generate Sitemaps and robots.txt**

#### **14.1 Sitemap Generation**

- **Use `next-sitemap` Package**
  ```bash
  npm install next-sitemap
  ```
- **Configure `next-sitemap.config.js`**
  ```javascript
  module.exports = {
    siteUrl: 'https://findatradespersonireland.com',
    generateRobotsTxt: true,
    // Exclude paths if necessary
    exclude: ['/api/*', '/admin/*'],
  };
  ```
- **Update `package.json` Scripts**
  ```json
  "scripts": {
    "postbuild": "next-sitemap"
  }
  ```

#### **14.2 robots.txt Configuration**

- **Automatic Generation**
  - `next-sitemap` will generate a `robots.txt` file based on your configuration.
- **Verify Crawling Permissions**
  - Ensure that all dynamic pages are allowed to be crawled.

---

#### **21.2 Pre-render Popular Pages**

- **Update `getStaticPaths`**
  - Include popular pages in the `paths` array to pre-render them at build time.

  ```typescript
  export const getStaticPaths: GetStaticPaths = async () => {
    const popularPages = await getPopularPages(); // Implement this function
    const paths = popularPages.map(({ tradeSlug, countySlug, townSlug }) => ({
      params: { tradeSlug, countySlug, townSlug },
    }));
    return {
      paths,
      fallback: 'blocking',
    };
  };
  ```
---

## **Actionable Items Checklist**

### **Phase 1: Project Setup**

- [x] Install Node.js and set up the development environment.
- [x] Initialize the Next.js project with TypeScript.
- [x] Set up version control with Git.
- [x] Configure ESLint and Prettier.
- [x] Install Tailwind CSS, shadcn/ui, and Lucide Icons.
- [x] Create static data files (`counties.json`, `trades.json`).
- [x] Set up environment variables.

### **Phase 2: UI/UX Foundation**

- [ ] Design and implement `Header`, `Footer`, and `MainLayout` components.
- [ ] Create reusable UI components (cards, buttons, breadcrumbs).
- [ ] Implement responsive navigation with icons.

### **Phase 3: Dynamic Routing and API Integration**

- [ ] Set up dynamic routing with `fallback: 'blocking'`.
- [ ] Create API utility functions to interact with DataForSEO.
- [ ] Handle errors and edge cases in data fetching.
- [ ] Implement ISR in `getStaticProps`.

### **Phase 4: Page Development**

- [ ] Build the homepage with featured sections.
- [ ] Develop trade, county, and town pages with dynamic content.
- [ ] Create individual tradesperson pages with detailed information.
- [ ] Ensure all pages are wrapped with `MainLayout`.

### **Phase 5: SEO Optimization**

- [ ] Optimize meta tags and descriptions using `next/head`.
- [ ] Add JSON-LD structured data for rich search results.
- [ ] Generate sitemaps using `next-sitemap`.
- [ ] Configure `robots.txt` for proper crawling.


## **Conclusion**

By following this comprehensive roadmap, you will develop a robust, SEO-friendly directory website for tradespeople in Ireland. The project is structured into manageable phases, allowing for focused development and ensuring that each aspect of the site is thoroughly addressed.

---

The homepage should look like this, use this styling throughout:

<styling from V0>

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Menu, MapPin, Phone, Mail, Facebook, Twitter, Instagram, Hammer, Wrench, Paintbrush, Truck, Scissors, Plug, HardHat, Shovel, Ruler, Thermometer, Zap, Droplet } from "lucide-react"

export default function HomePage() {
  const trades = [
    { name: "Carpenter", icon: Hammer },
    { name: "Plumber", icon: Wrench },
    { name: "Painter", icon: Paintbrush },
    { name: "Electrician", icon: Zap },
    { name: "Landscaper", icon: Shovel },
    { name: "Roofer", icon: HardHat },
    { name: "Mechanic", icon: Truck },
    { name: "Hairdresser", icon: Scissors },
    { name: "Tiler", icon: Ruler },
    { name: "HVAC Technician", icon: Thermometer },
    { name: "Locksmith", icon: Plug },
    { name: "Plaster", icon: Droplet },
    { name: "Bricklayer", icon: HardHat },
    { name: "Glazier", icon: Ruler },
    { name: "Flooring Specialist", icon: Ruler },
    { name: "Gardener", icon: Shovel },
  ]

  const counties = ["Dublin", "Cork", "Galway", "Limerick", "Waterford", "Kerry", "Mayo", "Sligo"]

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 hidden md:flex">
            <Link className="mr-6 flex items-center space-x-2" href="/">
              <Hammer className="h-6 w-6 text-green-600" />
              <span className="hidden font-bold sm:inline-block">
                Irish Tradesmen Directory
              </span>
            </Link>
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <Link href="/trades">Trades</Link>
              <Link href="/locations">Locations</Link>
              <Link href="/reviews">Reviews</Link>
              <Link href="/blog">Blog</Link>
            </nav>
          </div>
          <button className="inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-secondary text-secondary-foreground hover:bg-secondary/80 h-9 py-2 mr-2 px-3 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </button>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <div className="w-full flex-1 md:w-auto md:flex-none">
              <form>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search for a tradesman..."
                    className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
                  />
                </div>
              </form>
            </div>
            <Button className="hidden sm:flex">List Your Trade</Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-green-100">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Find Skilled Tradesmen in Ireland
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                  Connect with reliable local tradesmen for all your home improvement and repair needs.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form className="flex space-x-2">
                  <Input className="max-w-lg flex-1" placeholder="What trade are you looking for?" type="text" />
                  <Button type="submit">Search</Button>
                </form>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8">Popular Trades</h2>
            <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
              {trades.map((trade) => (
                <div key={trade.name} className="flex flex-col items-center p-4 bg-green-50 rounded-lg">
                  <trade.icon className="w-12 h-12 mb-2 text-green-600" />
                  <h3 className="text-lg font-semibold text-center">{trade.name}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8">Featured Locations</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {counties.map((county) => (
                <div key={county} className="flex flex-col p-4 bg-white rounded-lg shadow">
                  <h3 className="text-xl font-bold mb-2">{county}</h3>
                  <ul className="text-sm text-gray-500 space-y-1">
                    {[...Array(3)].map((_, i) => (
                      <li key={i} className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1 text-green-600" />
                        <span>Town {i + 1}, {county}</span>
                      </li>
                    ))}
                  </ul>
                  <Button variant="link" className="mt-4 self-start">View all in {county}</Button>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full py-12 md:py-24 lg:py-32 border-t bg-gray-100">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-4">
              <h4 className="text-lg font-bold">About Us</h4>
              <p className="text-sm text-gray-500">
                Irish Tradesmen Directory connects skilled professionals with customers across Ireland.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="text-lg font-bold">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><Link href="/about">About Us</Link></li>
                <li><Link href="/contact">Contact Us</Link></li>
                <li><Link href="/advertise">Advertise</Link></li>
                <li><Link href="/privacy">Privacy Policy</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-lg font-bold">Contact</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li className="flex items-center"><Phone className="w-4 h-4 mr-2" /> +353 1 234 5678</li>
                <li className="flex items-center"><Mail className="w-4 h-4 mr-2" /> info@irishtradesmendirectory.ie</li>
                <li className="flex items-center"><MapPin className="w-4 h-4 mr-2" /> Dublin, Ireland</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-lg font-bold">Follow Us</h4>
              <div className="flex space-x-4">
                <Link href="#" className="text-gray-500 hover:text-gray-600">
                  <Facebook className="w-6 h-6" />
                  <span className="sr-only">Facebook</span>
                </Link>
                <Link href="#" className="text-gray-500 hover:text-gray-600">
                  <Twitter className="w-6 h-6" />
                  <span className="sr-only">Twitter</span>
                </Link>
                <Link href="#" className="text-gray-500 hover:text-gray-600">
                  <Instagram className="w-6 h-6" />
                  <span className="sr-only">Instagram</span>
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-12 text-center text-sm text-gray-500">
            © 2024 Irish Tradesmen Directory. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

<styling from v0>


Json response for data for seo:

{
  "id": "10201831-8018-0139-0000-075436f9f787",
  "status_code": 20000,
  "status_message": "Ok.",
  "time": "8.0498 sec.",
  "cost": 0.002,
  "result_count": 1,
  "path": [
    "v3",
    "serp",
    "google",
    "maps",
    "live",
    "advanced"
  ],
  "data": {
    "api": "serp",
    "function": "live",
    "se": "google",
    "se_type": "maps",
    "keyword": "electrician athenry",
    "location_code": 2372,
    "language_code": "en",
    "device": "desktop",
    "os": "windows",
    "depth": 100
  },
  "result": [
    {
      "keyword": "electrician athenry",
      "type": "maps",
      "se_domain": "google.ie",
      "location_code": 2372,
      "language_code": "en",
      "check_url": "https://google.ie/maps/search/electrician+athenry/@53.7797554,-7.3055309,7z?hl=en&gl=IE&uule=w+CAIQIFISCfsnQFzkullIEQj02840EnzP",
      "datetime": "2024-10-20 15:31:55 +00:00",
      "spell": null,
      "refinement_chips": null,
      "item_types": [
        "maps_search"
      ],
      "se_results_count": 0,
      "items_count": 88,
      "items": [
        {
          "type": "maps_search",
          "rank_group": 1,
          "rank_absolute": 1,
          "domain": "www.amelectricalgalway.ie",
          "title": "AM Electrical Services",
          "url": "https://www.amelectricalgalway.ie/",
          "contact_url": null,
          "contributor_url": "https://maps.google.com/maps/contrib/107102679619149610662",
          "rating": {
            "rating_type": "Max5",
            "value": 5,
            "votes_count": 101,
            "rating_max": null
          },
          "hotel_rating": null,
          "price_level": null,
          "rating_distribution": {
            "1": 0,
            "2": 0,
            "3": 0,
            "4": 0,
            "5": 101
          },
          "snippet": null,
          "address": null,
          "address_info": {
            "borough": null,
            "address": null,
            "city": null,
            "zip": null,
            "region": null,
            "country_code": null
          },
          "place_id": "ChIJQSZ1bZWWW0gRk8tevy2m0bg",
          "phone": "+353862325614",
          "main_image": "https://lh5.googleusercontent.com/p/AF1QipOlmPjjo2Ublez4WmuCE1e-X61JefXYG-8IwKBI=w408-h270-k-no",
          "total_photos": 4,
          "category": "Electrician",
          "additional_categories": [
            "Service establishment"
          ],
          "category_ids": [
            "electrician",
            "establishment_service"
          ],
          "work_hours": {
            "timetable": {
              "sunday": null,
              "monday": [
                {
                  "open": {
                    "hour": 8,
                    "minute": 0
                  },
                  "close": {
                    "hour": 17,
                    "minute": 0
                  }
                }
              ],
              "tuesday": [
                {
                  "open": {
                    "hour": 8,
                    "minute": 0
                  },
                  "close": {
                    "hour": 17,
                    "minute": 0
                  }
                }
              ],
              "wednesday": [
                {
                  "open": {
                    "hour": 8,
                    "minute": 0
                  },
                  "close": {
                    "hour": 17,
                    "minute": 0
                  }
                }
              ],
              "thursday": [
                {
                  "open": {
                    "hour": 8,
                    "minute": 0
                  },
                  "close": {
                    "hour": 17,
                    "minute": 0
                  }
                }
              ],
              "friday": [
                {
                  "open": {
                    "hour": 8,
                    "minute": 0
                  },
                  "close": {
                    "hour": 17,
                    "minute": 0
                  }
                }
              ],
              "saturday": [
                {
                  "open": {
                    "hour": 8,
                    "minute": 0
                  },
                  "close": {
                    "hour": 12,
                    "minute": 0
                  }
                }
              ]
            },
            "current_status": "close"
          },
          "feature_id": "0x485b96956d752641:0xb8d1a62dbf5ecb93",
          "cid": "13317608288525667219",
          "latitude": 53.343532499999995,
          "longitude": -9.1348197,
          "is_claimed": true,
          "local_justifications": null,
          "is_directory_item": false
        },
        {
          "type": "maps_search",
          "rank_group": 2,
          "rank_absolute": 2,
          "domain": null,
          "title": "Brennan Electrical Contractors Limited",
          "url": null,
          "contact_url": null,
          "contributor_url": null,
          "rating": {
            "rating_type": "Max5",
            "value": 5,
            "votes_count": 1,
            "rating_max": null
          },
          "hotel_rating": null,
          "price_level": null,
          "rating_distribution": {
            "1": 0,
            "2": 0,
            "3": 0,
            "4": 0,
            "5": 1
          },
          "snippet": "Raford House, Athenry, Co. Galway",
          "address": "Raford House, Athenry, Co. Galway",
          "address_info": {
            "borough": "Raford",
            "address": "Raford House",
            "city": "Athenry",
            "zip": null,
            "region": "Co. Galway",
            "country_code": "IE"
          },
          "place_id": "ChIJgUCBcAh3XEgRmfNirn8inUw",
          "phone": "+35391848820",
          "main_image": "https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=6VcHVlWMC4yx9N97uzwcUw&cb_client=search.gws-prod.gps&w=408&h=240&yaw=119.336586&pitch=0&thumbfov=100",
          "total_photos": 1,
          "category": "Electrician",
          "additional_categories": null,
          "category_ids": [
            "electrician"
          ],
          "work_hours": {
            "timetable": null,
            "current_status": "close"
          },
          "feature_id": "0x485c770870814081:0x4c9d227fae62f399",
          "cid": "5520606650008007577",
          "latitude": 53.285583499999994,
          "longitude": -8.599885,
          "is_claimed": false,
          "local_justifications": null,
          "is_directory_item": false
        },
        {
          "type": "maps_search",
          "rank_group": 3,
          "rank_absolute": 3,
          "domain": "www.facebook.com",
          "title": "Watts Up Electrical",
          "url": "http://www.facebook.com/JohnWattsUpElectrical/",
          "contact_url": null,
          "contributor_url": "https://maps.google.com/maps/contrib/106033714972078809627",
          "rating": {
            "rating_type": "Max5",
            "value": 5,
            "votes_count": 7,
            "rating_max": null
          },
          "hotel_rating": null,
          "price_level": null,
          "rating_distribution": {
            "1": 0,
            "2": 0,
            "3": 0,
            "4": 0,
            "5": 7
          },
          "snippet": "Carnmore Rd, Carnmore East, Co. Galway",
          "address": "Carnmore Rd, Carnmore East, Co. Galway",
          "address_info": {
            "borough": "Carnmore East",
            "address": "Carnmore Rd",
            "city": null,
            "zip": null,
            "region": "Co. Galway",
            "country_code": "IE"
          },
          "place_id": "ChIJLyDsMfaRW0gRrcggaxc0jeE",
          "phone": "+353874111744",
          "main_image": "https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=J0bLD5eoVK3-Cc_E7GHA-A&cb_client=search.gws-prod.gps&w=408&h=240&yaw=176.786&pitch=0&thumbfov=100",
          "total_photos": 4,
          "category": "Electrician",
          "additional_categories": null,
          "category_ids": [
            "electrician"
          ],
          "work_hours": {
            "timetable": null,
            "current_status": "close"
          },
          "feature_id": "0x485b91f631ec202f:0xe18d34176b20c8ad",
          "cid": "16252703905436190893",
          "latitude": 53.3046825,
          "longitude": -8.932483999999999,
          "is_claimed": true,
          "local_justifications": null,
          "is_directory_item": false
        },
        {
          "type": "maps_search",
          "rank_group": 4,
          "rank_absolute": 4,
          "domain": null,
          "title": "Electrician Galway",
          "url": null,
          "contact_url": null,
          "contributor_url": "https://maps.google.com/maps/contrib/100379334993315001055",
          "rating": {
            "rating_type": "Max5",
            "value": 5,
            "votes_count": 7,
            "rating_max": null
          },
          "hotel_rating": null,
          "price_level": null,
          "rating_distribution": {
            "1": 0,
            "2": 0,
            "3": 0,
            "4": 0,
            "5": 7
          },
          "snippet": null,
          "address": null,
          "address_info": {
            "borough": null,
            "address": null,
            "city": null,
            "zip": null,
            "region": null,
            "country_code": null
          },
          "place_id": "ChIJj4EhP96XW0gRyXqTd91pldY",
          "phone": "+35391398147",
          "main_image": "https://lh5.googleusercontent.com/p/AF1QipNmZsozH3YavzsKn7GFD5wvEjwU42GahIq_69OX=w408-h271-k-no",
          "total_photos": 4,
          "category": "Electrician",
          "additional_categories": [
            "Service establishment"
          ],
          "category_ids": [
            "electrician",
            "establishment_service"
          ],
          "work_hours": {
            "timetable": {
              "sunday": [
                {
                  "open": {
                    "hour": 8,
                    "minute": 0
                  },
                  "close": {
                    "hour": 18,
                    "minute": 0
                  }
                }
              ],
              "monday": [
                {
                  "open": {
                    "hour": 8,
                    "minute": 0
                  },
                  "close": {
                    "hour": 18,
                    "minute": 0
                  }
                }
              ],
              "tuesday": [
                {
                  "open": {
                    "hour": 8,
                    "minute": 0
                  },
                  "close": {
                    "hour": 18,
                    "minute": 0
                  }
                }
              ],
              "wednesday": [
                {
                  "open": {
                    "hour": 8,
                    "minute": 0
                  },
                  "close": {
                    "hour": 18,
                    "minute": 0
                  }
                }
              ],
              "thursday": [
                {
                  "open": {
                    "hour": 8,
                    "minute": 0
                  },
                  "close": {
                    "hour": 18,
                    "minute": 0
                  }
                }
              ],
              "friday": [
                {
                  "open": {
                    "hour": 8,
                    "minute": 0
                  },
                  "close": {
                    "hour": 18,
                    "minute": 0
                  }
                }
              ],
              "saturday": [
                {
                  "open": {
                    "hour": 8,
                    "minute": 0
                  },
                  "close": {
                    "hour": 18,
                    "minute": 0
                  }
                }
              ]
            },
            "current_status": "open"
          },
          "feature_id": "0x485b97de3f21818f:0xd69569dd77937ac9",
          "cid": "15462381295561308873",
          "latitude": 53.283911499999995,
          "longitude": -9.0487465,
          "is_claimed": true,
          "local_justifications": null,
          "is_directory_item": false
        },
        {
          "type": "maps_search",
          "rank_group": 5,
          "rank_absolute": 5,
          "domain": "www.joyceelectrical.ie",
          "title": "Joyce Electrical and Solar PV",
          "url": "https://www.joyceelectrical.ie/",
          "contact_url": "https://www.joyceelectrical.ie/contact-us/",
          "contributor_url": "https://maps.google.com/maps/contrib/114700010964231363753",
          "rating": {
            "rating_type": "Max5",
            "value": 5,
            "votes_count": 78,
            "rating_max": null
          },
          "hotel_rating": null,
          "price_level": null,
          "rating_distribution": {
            "1": 0,
            "2": 1,
            "3": 0,
            "4": 0,
            "5": 77
          },
          "snippet": null,
          "address": null,
          "address_info": {
            "borough": null,
            "address": null,
            "city": null,
            "zip": null,
            "region": null,
            "country_code": null
          },
          "place_id": "ChIJn_wxJAnHW0gR0b1cii6KMhY",
          "phone": "+353858349461",
          "main_image": "https://lh5.googleusercontent.com/p/AF1QipNWbfKhXEyo_TkaEGXRJZCBCriUW1n_kr0COLQy=w426-h240-k-no",
          "total_photos": 611,
          "category": "Solar energy company",
          "additional_categories": [
            "Electric vehicle charging station contractor",
            "Service establishment"
          ],
          "category_ids": [
            "solar_energy_company",
            "electric_vehicle_charging_station_contractor",
            "establishment_service"
          ],
          "work_hours": {
            "timetable": {
              "sunday": null,
              "monday": [
                {
                  "open": {
                    "hour": 7,
                    "minute": 0
                  },
                  "close": {
                    "hour": 19,
                    "minute": 0
                  }
                }
              ],
              "tuesday": [
                {
                  "open": {
                    "hour": 7,
                    "minute": 0
                  },
                  "close": {
                    "hour": 19,
                    "minute": 0
                  }
                }
              ],
              "wednesday": [
                {
                  "open": {
                    "hour": 7,
                    "minute": 0
                  },
                  "close": {
                    "hour": 19,
                    "minute": 0
                  }
                }
              ],
              "thursday": [
                {
                  "open": {
                    "hour": 7,
                    "minute": 0
                  },
                  "close": {
                    "hour": 19,
                    "minute": 0
                  }
                }
              ],
              "friday": [
                {
                  "open": {
                    "hour": 7,
                    "minute": 0
                  },
                  "close": {
                    "hour": 19,
                    "minute": 0
                  }
                }
              ],
              "saturday": [
                {
                  "open": {
                    "hour": 7,
                    "minute": 0
                  },
                  "close": {
                    "hour": 17,
                    "minute": 0
                  }
                }
              ]
            },
            "current_status": "close"
          },
          "feature_id": "0x485bc7092431fc9f:0x16328a2e8a5cbdd1",
          "cid": "1599492750164409809",
          "latitude": 53.343532499999995,
          "longitude": -9.1348197,
          "is_claimed": true,
          "local_justifications": null,
          "is_directory_item": false
        },
        {
          "type": "maps_search",
          "rank_group": 6,
          "rank_absolute": 6,
          "domain": null,
          "title": "Ray Regan Electrical",
          "url": null,
          "contact_url": null,
          "contributor_url": "https://maps.google.com/maps/contrib/116458503539380477663",
          "rating": {
            "rating_type": "Max5",
            "value": 5,
            "votes_count": 9,
            "rating_max": null
          },
          "hotel_rating": null,
          "price_level": null,
          "rating_distribution": {
            "1": 0,
            "2": 0,
            "3": 0,
            "4": 0,
            "5": 9
          },
          "snippet": null,
          "address": null,
          "address_info": {
            "borough": null,
            "address": null,
            "city": null,
            "zip": null,
            "region": null,
            "country_code": null
          },
          "place_id": "ChIJx-ABqb55XEgRwCljAY6NZeY",
          "phone": "+353867256869",
          "main_image": "https://lh5.googleusercontent.com/p/AF1QipOO2Dvc0iUA_inOUxDcj-z96k8SJY-s1-nQ7sNk=w408-h725-k-no",
          "total_photos": 4,
          "category": "Electrician",
          "additional_categories": [
            "Service establishment"
          ],
          "category_ids": [
            "electrician",
            "establishment_service"
          ],
          "work_hours": {
            "timetable": {
              "sunday": [
                {
                  "open": {
                    "hour": 0,
                    "minute": 0
                  },
                  "close": {
                    "hour": 0,
                    "minute": 0
                  }
                }
              ],
              "monday": [
                {
                  "open": {
                    "hour": 0,
                    "minute": 0
                  },
                  "close": {
                    "hour": 0,
                    "minute": 0
                  }
                }

Documentation:

curl --location --request POST 'https://api.dataforseo.com/v3/serp/google/maps/live/advanced' \
--header 'Authorization: Basic aGVsbG9AaGFyYm9yc2VvLmFpOjQ0YzE4YWY4ZmIwYWVlMDg=' \
--header 'Content-Type: application/json' \
--data-raw '[{"keyword":"electrician athenry", "location_code":2380, "language_code":"en", "device":"desktop", "os":"windows", "depth":100}]'


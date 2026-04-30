import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Seeding database...");

    // Create categories
    const bakery = await prisma.category.upsert({
        where: { slug: "bakery" },
        update: {},
        create: { name: "Bakery & Sweets", slug: "bakery", description: "Freshly baked cakes, cookies, and pastries", image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400" },
    });
    const cookies = await prisma.category.upsert({
        where: { slug: "cookies" },
        update: {},
        create: { name: "Cookies & Treats", slug: "cookies", description: "Handmade cookies and sweet treats", image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400", parentId: bakery.id },
    });
    const fashion = await prisma.category.upsert({
        where: { slug: "fashion" },
        update: {},
        create: { name: "Women's Fashion", slug: "fashion", description: "Dresses, tops, and accessories", image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400" },
    });
    const mens = await prisma.category.upsert({
        where: { slug: "mens" },
        update: {},
        create: { name: "Men's Clothing", slug: "mens", description: "Shirts, trousers, and casual wear" },
    });
    const homeDecor = await prisma.category.upsert({
        where: { slug: "home-decor" },
        update: {},
        create: { name: "Home & Décor", slug: "home-decor", description: "Transform your living space" },
    });
    const accessories = await prisma.category.upsert({
        where: { slug: "accessories" },
        update: {},
        create: { name: "Accessories", slug: "accessories", description: "Bags, jewelry, and more" },
    });
    const kids = await prisma.category.upsert({
        where: { slug: "kids" },
        update: {},
        create: { name: "Kids & Toys", slug: "kids", description: "Fun products for children" },
    });
    const beauty = await prisma.category.upsert({
        where: { slug: "beauty" },
        update: {},
        create: { name: "Beauty & Care", slug: "beauty", description: "Skincare and beauty products" },
    });

    console.log("✅ Categories created");

    // Admin user
    const adminPassword = await bcrypt.hash("admin123456", 12);
    await prisma.user.upsert({
        where: { email: "admin@luxemarket.com" },
        update: {},
        create: {
            name: "Admin User",
            email: "admin@luxemarket.com",
            password: adminPassword,
            role: "ADMIN",
        },
    });

    // Test customer
    const customerPassword = await bcrypt.hash("customer123", 12);
    await prisma.user.upsert({
        where: { email: "customer@example.com" },
        update: {},
        create: {
            name: "Jane Smith",
            email: "customer@example.com",
            password: customerPassword,
            role: "CUSTOMER",
        },
    });

    console.log("✅ Users created");

    // Products
    const products = [
        // Bakery
        {
            name: "Classic Chocolate Birthday Cake",
            slug: "classic-chocolate-birthday-cake",
            description: "Rich, moist chocolate cake with silky ganache frosting and chocolate shavings. Perfect for celebrations. Serves 8-12 people. Handcrafted fresh daily by our master bakers.",
            price: 48.99,
            comparePrice: 65.00,
            images: JSON.stringify(["https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600", "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=600"]),
            categoryId: bakery.id,
            stock: 15,
            featured: true,
            rating: 4.9,
            reviewCount: 342,
            tags: JSON.stringify(["birthday", "chocolate", "cake", "celebration"]),
        },
        {
            name: "Vanilla Bean Celebration Cake",
            slug: "vanilla-bean-celebration-cake",
            description: "Light and fluffy vanilla cake with real vanilla bean cream cheese frosting. Elegant and delicious for any occasion. Can be customized with your message.",
            price: 44.99,
            comparePrice: null,
            images: JSON.stringify(["https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=600", "https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=600"]),
            categoryId: bakery.id,
            stock: 12,
            featured: true,
            rating: 4.8,
            reviewCount: 218,
            tags: JSON.stringify(["vanilla", "cake", "wedding"]),
        },
        {
            name: "Red Velvet Dream Cake",
            slug: "red-velvet-dream-cake",
            description: "Classic Southern red velvet cake with layers of cream cheese frosting. A stunning and delicious centerpiece for your celebration.",
            price: 52.99,
            comparePrice: 70.00,
            images: JSON.stringify(["https://images.unsplash.com/photo-1586788680434-30d324b2d46f?w=600"]),
            categoryId: bakery.id,
            stock: 8,
            featured: false,
            rating: 4.7,
            reviewCount: 156,
            tags: JSON.stringify(["red velvet", "cake"]),
        },
        {
            name: "Artisan Cookie Gift Box (24 pcs)",
            slug: "artisan-cookie-gift-box",
            description: "A beautiful assortment of 24 handmade cookies including chocolate chip, snickerdoodle, oatmeal raisin, and shortbread. Packaged in an elegant gift box — perfect for gifting.",
            price: 32.99,
            comparePrice: 45.00,
            images: JSON.stringify(["https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=600", "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600"]),
            categoryId: cookies.id,
            stock: 30,
            featured: true,
            rating: 4.9,
            reviewCount: 521,
            tags: JSON.stringify(["cookies", "gift", "assorted"]),
        },
        {
            name: "Chocolate Chip Cookie Dozen",
            slug: "chocolate-chip-cookie-dozen",
            description: "Our famous thick, chewy chocolate chip cookies baked to golden perfection. Made with premium Belgian chocolate chips and real butter. 12 cookies per pack.",
            price: 16.99,
            comparePrice: null,
            images: JSON.stringify(["https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=600"]),
            categoryId: cookies.id,
            stock: 50,
            featured: false,
            rating: 4.8,
            reviewCount: 89,
            tags: JSON.stringify(["cookies", "chocolate chip"]),
        },
        {
            name: "Macaron Tower (30 pcs)",
            slug: "macaron-tower",
            description: "Elegant French macarons in 6 flavors: raspberry, pistachio, lavender, salted caramel, lemon, and chocolate. Hand-assembled tower makes a stunning gift.",
            price: 58.99,
            comparePrice: 75.00,
            images: JSON.stringify(["https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=600"]),
            categoryId: bakery.id,
            stock: 20,
            featured: true,
            rating: 4.9,
            reviewCount: 203,
            tags: JSON.stringify(["macarons", "french", "gift", "tower"]),
        },
        // Fashion
        {
            name: "Floral Wrap Midi Dress",
            slug: "floral-wrap-midi-dress",
            description: "Effortlessly chic wrap dress in a beautiful floral print. Adjustable waist tie for a flattering fit. Made from 100% viscose for a flowy, luxurious feel. Perfect for brunch, garden parties, and everything in between.",
            price: 79.99,
            comparePrice: 110.00,
            images: JSON.stringify(["https://images.unsplash.com/photo-1623609163859-ca93c959b98a?w=600", "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600"]),
            categoryId: fashion.id,
            stock: 45,
            featured: true,
            rating: 4.7,
            reviewCount: 312,
            tags: JSON.stringify(["dress", "floral", "midi", "summer"]),
        },
        {
            name: "Linen Blazer – Cream",
            slug: "linen-blazer-cream",
            description: "Sharp yet relaxed linen blazer in classic cream. Single-button closure, two front pockets. Perfect layered over a dress or with tailored trousers. 100% linen.",
            price: 99.99,
            comparePrice: 140.00,
            images: JSON.stringify(["https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=600"]),
            categoryId: fashion.id,
            stock: 28,
            featured: true,
            rating: 4.6,
            reviewCount: 178,
            tags: JSON.stringify(["blazer", "linen", "cream", "workwear"]),
        },
        {
            name: "Satin Evening Gown",
            slug: "satin-evening-gown",
            description: "Stunning floor-length satin gown with a cowl neckline and backless design. Perfect for formal events, galas, and special occasions. Available in midnight blue and champagne.",
            price: 189.99,
            comparePrice: 260.00,
            images: JSON.stringify(["https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600"]),
            categoryId: fashion.id,
            stock: 18,
            featured: true,
            rating: 4.9,
            reviewCount: 94,
            tags: JSON.stringify(["gown", "formal", "evening", "satin"]),
        },
        {
            name: "Classic Oxford Shirt – White",
            slug: "classic-oxford-shirt-white",
            description: "A wardrobe essential. Crisp Oxford cotton shirt with a button-down collar. Versatile enough for business or casual wear. Slim fit, available in M, L, XL, XXL.",
            price: 65.99,
            comparePrice: null,
            images: JSON.stringify(["https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600"]),
            categoryId: mens.id,
            stock: 55,
            featured: false,
            rating: 4.5,
            reviewCount: 267,
            tags: JSON.stringify(["shirt", "oxford", "mens", "white"]),
        },
        // Home & Decor
        {
            name: "Handwoven Jute Rug 4x6",
            slug: "handwoven-jute-rug",
            description: "Beautifully textured natural jute rug, hand-woven by artisans. Brings warmth and natural texture to any room. Size: 4ft × 6ft. Easy to clean, durable.",
            price: 119.99,
            comparePrice: 160.00,
            images: JSON.stringify(["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600"]),
            categoryId: homeDecor.id,
            stock: 22,
            featured: false,
            rating: 4.6,
            reviewCount: 143,
            tags: JSON.stringify(["rug", "jute", "natural", "home"]),
        },
        {
            name: "Ceramic Vase Set (3 pieces)",
            slug: "ceramic-vase-set",
            description: "Minimalist ceramic vases in three complementary sizes and matte earth tones. Handmade and unique. Perfect as a statement centerpiece or shelf décor.",
            price: 58.99,
            comparePrice: 78.00,
            images: JSON.stringify(["https://images.unsplash.com/photo-1612690099756-57f2c2512df8?w=600"]),
            categoryId: homeDecor.id,
            stock: 35,
            featured: false,
            rating: 4.8,
            reviewCount: 97,
            tags: JSON.stringify(["vase", "ceramic", "home", "decor"]),
        },
        // Accessories
        {
            name: "Leather Tote Bag – Tan",
            slug: "leather-tote-bag-tan",
            description: "Spacious genuine leather tote bag with magnetic closure and multiple interior pockets. Perfect for work, travel, or everyday use. Ages beautifully with use.",
            price: 149.99,
            comparePrice: 200.00,
            images: JSON.stringify(["https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600"]),
            categoryId: accessories.id,
            stock: 25,
            featured: true,
            rating: 4.8,
            reviewCount: 289,
            tags: JSON.stringify(["bag", "leather", "tote", "accessories"]),
        },
        {
            name: "Gold Layered Necklace Set",
            slug: "gold-layered-necklace-set",
            description: "Dainty set of 3 layering necklaces in 18k gold-plated brass. Includes a choker, pendant, and long chain style. Tarnish-resistant and hypoallergenic.",
            price: 38.99,
            comparePrice: 55.00,
            images: JSON.stringify(["https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600"]),
            categoryId: accessories.id,
            stock: 60,
            featured: false,
            rating: 4.7,
            reviewCount: 412,
            tags: JSON.stringify(["necklace", "gold", "jewelry", "layering"]),
        },
    ];

    for (const product of products) {
        await prisma.product.upsert({
            where: { slug: product.slug },
            update: {},
            create: product,
        });
    }

    console.log(`✅ ${products.length} products created`);
    console.log("\n🎉 Database seeded successfully!");
    console.log("\n📧 Admin login: admin@luxemarket.com / admin123456");
    console.log("📧 Customer login: customer@example.com / customer123");
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());

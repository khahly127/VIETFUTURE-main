function getDemoDataForRole(roleName) {
  let norm = String(roleName || "").trim().toLowerCase();
  if (norm.includes("frontend")) norm = "frontend";
  else if (norm.includes("backend")) norm = "backend";
  else if (norm.includes("fullstack")) norm = "fullstack";
  else if (norm.includes("data") || norm.includes("ml") || norm.includes("ai")) norm = "data";
  else if (norm.includes("mobile")) norm = "mobile";
  else if (norm.includes("devops")) norm = "devops";
  else if (norm.includes("security") || norm.includes("cyber")) norm = "security";
  else if (norm.includes("ui") || norm.includes("ux") || norm.includes("design")) norm = "uiux";
  else norm = "backend"; // Fallback to backend as default

  const mockResources = [
    { icon: "📖", type: "doc", title: "Tài liệu học tập chính thức", meta: "devdocs.io", tag: "free" },
    { icon: "🎬", type: "video", title: "Khóa học video hướng dẫn chi tiết", meta: "FreeCodeCamp", tag: "free" }
  ];

  if (norm === "frontend") {
    return {
      username: "Học Viên DevPath",
      role: "Frontend Engineer",
      roleEmoji: "💻",
      roleMeta: "11 kỹ năng cốt lõi · Lộ trình 3–6 tháng",
      score: 70,
      phases: [
        { label: "Nền tảng HTML & CSS", cls: "p1" },
        { label: "JavaScript & Browser", cls: "p2" },
        { label: "React & Framework", cls: "p3" },
        { label: "Performance & Tooling", cls: "p4" }
      ],
      cols: [
        ["html", "css", "flexbox"],
        ["_", "es6", "dom", "_"],
        ["_", "jsx", "hooks", "routing"],
        ["bundler", "testing", "deploy"]
      ],
      connections: [
        ["html", "es6"], ["css", "dom"], ["flexbox", "dom"],
        ["es6", "jsx"], ["dom", "jsx"], ["dom", "hooks"],
        ["jsx", "routing"], ["hooks", "routing"], ["hooks", "testing"],
        ["testing", "bundler"], ["routing", "deploy"], ["bundler", "deploy"]
      ],
      nodes: {
        html: {
          icon: "📄", title: "Semantic HTML5 & SEO", sub: "Thẻ ngữ nghĩa, Accessibility",
          desc: "Xây dựng cấu trúc HTML ngữ nghĩa chuẩn để tối ưu SEO và khả năng tiếp cận cho người khuyết tật.",
          status: "todo", pct: 0, cvMatch: false,
          checklist: ["Sử dụng các thẻ semantic (header, section, article)", "Cấu hình meta tags cho SEO", "Kiểm soát Accessibility với ARIA labels"],
          checkState: [false, false, false], resources: mockResources
        },
        css: {
          icon: "🎨", title: "CSS3 Advanced Styling", sub: "Flexbox, Grid, Animation",
          desc: "Nắm vững CSS3 để tạo giao diện đẹp mắt, responsive, và có animation mượt mà.",
          status: "todo", pct: 0, cvMatch: false,
          checklist: ["Thiết kế CSS Grid 2D layouts", "Sử dụng Flexbox cho alignment", "Tạo animation và transition"],
          checkState: [false, false, false], resources: mockResources
        },
        flexbox: {
          icon: "📐", title: "Flexbox Layout Mastery", sub: "Align, justify, direction",
          desc: "Quản lý bố cục một chiều linh hoạt với Flexbox để tạo trang web responsive.",
          status: "todo", pct: 0, cvMatch: false,
          checklist: ["Align-items, justify-content control", "Flex direction & wrap", "Flex grow, shrink, basis"],
          checkState: [false, false, false], resources: mockResources
        },
        es6: {
          icon: "⚡", title: "ES6+ JavaScript Features", sub: "Arrow functions, Destructuring, Async/Await",
          desc: "Làm chủ cú pháp JavaScript hiện đại để viết code sạch, ngắn gọn và hiệu quả hơn.",
          status: "todo", pct: 0, cvMatch: false,
          checklist: ["Const/Let + arrow functions", "Destructuring & spread operator", "Promises & Async/Await"],
          checkState: [false, false, false], resources: mockResources
        },
        dom: {
          icon: "🌳", title: "DOM Manipulation & Events", sub: "querySelector, Event listeners",
          desc: "Tương tác trực tiếp với DOM để cập nhật nội dung, lắng nghe sự kiện người dùng.",
          status: "todo", pct: 0, cvMatch: false,
          checklist: ["Chọn phần tử với querySelector", "Thêm/xóa/sửa DOM elements", "Xử lý event delegation hiệu quả"],
          checkState: [false, false, false], resources: mockResources
        },
        jsx: {
          icon: "⚛️", title: "JSX & React Basics", sub: "Components, Props, Rendering",
          desc: "Bắt đầu React bằng cách viết JSX để tạo các component tái sử dụng.",
          status: "todo", pct: 0, cvMatch: false,
          checklist: ["Viết functional components", "Truyền & nhận Props", "Render conditional elements"],
          checkState: [false, false, false], resources: mockResources
        },
        hooks: {
          icon: "🪝", title: "React Hooks Advanced", sub: "useState, useEffect, useContext",
          desc: "Quản lý state và side-effects trong functional components với React Hooks.",
          status: "todo", pct: 0, cvMatch: false,
          checklist: ["useState cho state management", "useEffect cho lifecycle", "useContext for global state"],
          checkState: [false, false, false], resources: mockResources
        },
        routing: {
          icon: "🛣️", title: "React Router & Navigation", sub: "Routes, Link, useNavigate",
          desc: "Xây dựng ứng dụng Single Page (SPA) với điều hướng mượt mà giữa các trang.",
          status: "todo", pct: 0, cvMatch: false,
          checklist: ["Cấu hình Routes & Outlets", "Sử dụng Link & useNavigate", "Xử lý route parameters & query"],
          checkState: [false, false, false], resources: mockResources
        },
        testing: {
          icon: "✅", title: "Component Testing & Jest", sub: "Unit tests, React Testing Library",
          desc: "Viết unit tests để đảm bảo component hoạt động chính xác, tránh regression bugs.",
          status: "todo", pct: 0, cvMatch: false,
          checklist: ["Viết Jest unit tests", "Test React components với RTL", "Đạt 80%+ code coverage"],
          checkState: [false, false, false], resources: mockResources
        },
        bundler: {
          icon: "📦", title: "Build Tools & Bundling", sub: "Webpack, Vite, Build optimization",
          desc: "Tối ưu hóa bundle size, lazy loading, tree-shaking để load page nhanh hơn.",
          status: "todo", pct: 0, cvMatch: false,
          checklist: ["Cấu hình Webpack/Vite", "Code splitting & lazy loading", "Minification & compression"],
          checkState: [false, false, false], resources: mockResources
        },
        deploy: {
          icon: "🚀", title: "Deploy & Performance Optimization", sub: "Vercel, Netlify, CDN",
          desc: "Triển khai ứng dụng lên production và tối ưu Core Web Vitals để trang load cực nhanh.",
          status: "todo", pct: 0, cvMatch: false,
          checklist: ["Deploy lên Vercel/Netlify", "Tối ưu LCP, FID, CLS metrics", "Cấu hình caching & CDN"],
          checkState: [false, false, false], resources: mockResources
        }
      }
    };
  }

  if (norm === "fullstack") {
    return {
      username: "Học Viên DevPath",
      role: "Fullstack Engineer",
      roleEmoji: "⚡",
      roleMeta: "10 kỹ năng cốt lõi · Lộ trình 4–7 tháng",
      score: 70,
      phases: [
        { label: "Kiến trúc ứng dụng", cls: "p1" },
        { label: "API & Real-time", cls: "p2" },
        { label: "Cơ sở dữ liệu", cls: "p3" },
        { label: "Bảo mật & Tối ưu", cls: "p4" }
      ],
      cols: [
        ["mvc", "hydration", "_"],
        ["_", "graphql", "websockets"],
        ["_", "nosql", "orm", "pooling"],
        ["xss", "csrf", "cdn"]
      ],
      connections: [
        ["mvc", "graphql"], ["hydration", "graphql"], ["hydration", "websockets"],
        ["graphql", "nosql"], ["websockets", "nosql"],
        ["nosql", "orm"], ["orm", "pooling"],
        ["pooling", "xss"], ["pooling", "csrf"],
        ["xss", "cdn"], ["csrf", "cdn"]
      ],
      nodes: {
        mvc: {
          icon: "📐", title: "MVC Architectural Design", sub: "Model-View-Controller pattern",
          desc: "Hiểu kiến trúc MVC để phân tách luồng logic, dữ liệu và giao diện chuẩn.",
          status: "todo", pct: 0, cvMatch: false,
          checklist: ["Phân chia Controller & Route", "Thiết lập Model định nghĩa dữ liệu", "Render View độc lập"],
          checkState: [false, false, false], resources: mockResources
        },
        hydration: {
          icon: "💧", title: "Next.js Hydration Model", sub: "SSR, Client-side Hydration",
          desc: "Cơ chế kết hợp giữa Server-side Rendering và tương tác động Client side.",
          status: "todo", pct: 0, cvMatch: false,
          checklist: ["SSR rendering cycle", "Hydration error debugging", "Client components loading"],
          checkState: [false, false, false], resources: mockResources
        },
        graphql: {
          icon: "🕸️", title: "GraphQL Query Data-fetching", sub: "Queries, Mutations, Schema",
          desc: "Giải pháp truy vấn API linh hoạt giúp Client tự định nghĩa cấu trúc dữ liệu cần lấy.",
          status: "todo", pct: 0, cvMatch: false,
          checklist: ["Tạo schema GraphQL", "Viết Query & Mutation", "Tối ưu hóa resolver"],
          checkState: [false, false, false], resources: mockResources
        },
        websockets: {
          icon: "🔌", title: "WebSockets Real-time Comm", sub: "Bi-directional communication",
          desc: "Duy trì kết nối hai chiều thời gian thực liên tục giữa Client và Server.",
          status: "todo", pct: 0, cvMatch: false,
          checklist: ["Khởi tạo socket connection", "Emit và Listen events", "Xử lý mất kết nối tự động"],
          checkState: [false, false, false], resources: mockResources
        },
        nosql: {
          icon: "🍃", title: "NoSQL Document Databases", sub: "MongoDB, Collections",
          desc: "Lưu trữ dữ liệu phi cấu trúc linh hoạt dạng JSON/BSON phù hợp scale nhanh.",
          status: "todo", pct: 0, cvMatch: false,
          checklist: ["Tạo collections động", "Truy vấn lồng nhau", "Aggregation pipeline"],
          checkState: [false, false, false], resources: mockResources
        },
        orm: {
          icon: "💾", title: "ORM Framework Integration", sub: "Prisma, Sequelize",
          desc: "Ánh xạ cơ sở dữ liệu quan hệ sang lập trình hướng đối tượng trong code.",
          status: "todo", pct: 0, cvMatch: false,
          checklist: ["Cấu hình Prisma Schema", "Chạy DB Migration", "Thực hiện CRUD bằng ORM"],
          checkState: [false, false, false], resources: mockResources
        },
        pooling: {
          icon: "🏊", title: "Database Connection Pooling", sub: "Connection reuse, performance",
          desc: "Tối ưu hóa tài nguyên server bằng cách tái sử dụng các kết nối DB sẵn có.",
          status: "todo", pct: 0, cvMatch: false,
          checklist: ["Cấu hình connection pool size", "Tránh nghẽn DB connection", "Giải phóng kết nối nhàn rỗi"],
          checkState: [false, false, false], resources: mockResources
        },
        xss: {
          icon: "🛡️", title: "Cross-Site Scripting (XSS)", sub: "Sanitization, escaping",
          desc: "Ngăn chặn chèn script độc hại bằng cách sanitize dữ liệu đầu vào.",
          status: "todo", pct: 0, cvMatch: false,
          checklist: ["Sanitize user inputs", "Escape HTML outputs", "Thiết lập Content Security Policy"],
          checkState: [false, false, false], resources: mockResources
        },
        csrf: {
          icon: "🔑", title: "CSRF Security Vulnerability", sub: "SameSite, Anti-CSRF tokens",
          desc: "Phòng chống giả mạo yêu cầu từ site độc hại bằng cookie và token.",
          status: "todo", pct: 0, cvMatch: false,
          checklist: ["Thiết lập SameSite cookie attribute", "Cấu hình CSRF tokens", "Kiểm soát CORS Origins"],
          checkState: [false, false, false], resources: mockResources
        },
        cdn: {
          icon: "⚡", title: "CDN Static Latency Optimization", sub: "Cloudflare, edge caching",
          desc: "Mạng lưới phân phối nội dung tĩnh giúp giảm độ trễ truy cập toàn cầu.",
          status: "todo", pct: 0, cvMatch: false,
          checklist: ["Cấu hình Edge Caching", "Purge CDN cache", "Tối ưu hóa nén tệp tin tĩnh"],
          checkState: [false, false, false], resources: mockResources
        }
      }
    };
  }

  if (norm === "data") {
    return {
      username: "Học Viên DevPath",
      role: "Data Engineer",
      roleEmoji: "🔧",
      roleMeta: "11 kỹ năng cốt lõi · Lộ trình 5–8 tháng",
      score: 70,
      phases: [
        { label: "Nền tảng Python & SQL", cls: "p1" },
        { label: "Data Processing & ETL", cls: "p2" },
        { label: "Big Data & Databases", cls: "p3" },
        { label: "Monitoring & Optimization", cls: "p4" }
      ],
      cols: [
        ["python", "sql", "git"],
        ["_", "pandas", "spark", "_"],
        ["_", "hadoop", "kafka", "mongodb"],
        ["airflow", "monitoring", "docker"]
      ],
      connections: [
        ["python", "pandas"], ["sql", "pandas"], ["git", "pandas"],
        ["pandas", "spark"], ["pandas", "hadoop"], ["spark", "hadoop"],
        ["hadoop", "kafka"], ["kafka", "mongodb"], ["mongodb", "airflow"],
        ["airflow", "monitoring"], ["monitoring", "docker"], ["spark", "docker"]
      ],
      nodes: {
        python: {
          icon: "🐍", title: "Python Programming Fundamentals", sub: "Syntax, OOP, Libraries",
          desc: "Nắm vững Python cơ bản để xử lý dữ liệu, tự động hóa, và viết pipeline dữ liệu.",
          status: "todo", pct: 0, cvMatch: false,
          checklist: ["Control flow & Functions", "Object-Oriented Programming", "File handling & Exception handling"],
          checkState: [false, false, false], resources: mockResources
        },
        sql: {
          icon: "🗄️", title: "SQL Database & Queries", sub: "SELECT, JOIN, Aggregation, Indexing",
          desc: "Viết SQL queries hiệu năng cao để truy vấn, phân tích dữ liệu từ database quan hệ.",
          status: "todo", pct: 0, cvMatch: false,
          checklist: ["Complex JOINs & subqueries", "Aggregation functions (GROUP BY)", "Query optimization & Index tuning"],
          checkState: [false, false, false], resources: mockResources
        },
        git: {
          icon: "🔀", title: "Git & Version Control", sub: "Repositories, Branches, Collaboration",
          desc: "Quản lý code với Git để collaborate với team, track changes, và quản lý versions.",
          status: "todo", pct: 0, cvMatch: false,
          checklist: ["Git commit & push/pull", "Branching strategy", "Merge conflict resolution"],
          checkState: [false, false, false], resources: mockResources
        },
        pandas: {
          icon: "🐼", title: "Pandas Data Manipulation", sub: "DataFrames, Cleaning, Transformation",
          desc: "Xử lý dữ liệu bảng hiệu quả bằng Pandas để làm sạch, transform, và phân tích dữ liệu.",
          status: "todo", pct: 0, cvMatch: false,
          checklist: ["Read/write CSV, Excel, JSON", "Data cleaning & missing values", "GroupBy & Aggregation operations"],
          checkState: [false, false, false], resources: mockResources
        },
        spark: {
          icon: "⚡", title: "Apache Spark Distributed Computing", sub: "RDD, DataFrames, SQL",
          desc: "Xử lý dữ liệu quy mô lớn phân tán bằng Spark cho tốc độ xử lý gấp 100x so với Pandas.",
          status: "todo", pct: 0, cvMatch: false,
          checklist: ["Spark DataFrames & RDD operations", "Spark SQL queries", "Distributed computing optimization"],
          checkState: [false, false, false], resources: mockResources
        },
        hadoop: {
          icon: "🐘", title: "Hadoop Ecosystem & HDFS", sub: "MapReduce, HDFS, YARN",
          desc: "Xây dựng hệ thống lưu trữ và xử lý dữ liệu phân tán với Hadoop cho Big Data.",
          status: "todo", pct: 0, cvMatch: false,
          checklist: ["HDFS architecture & replication", "MapReduce job design", "YARN cluster management"],
          checkState: [false, false, false], resources: mockResources
        },
        kafka: {
          icon: "📨", title: "Apache Kafka Streaming", sub: "Topics, Consumers, Producers",
          desc: "Xây dựng pipeline dữ liệu real-time bằng Kafka để xử lý streaming data từ nhiều nguồn.",
          status: "todo", pct: 0, cvMatch: false,
          checklist: ["Kafka broker & topic configuration", "Producer & Consumer applications", "Stream processing jobs"],
          checkState: [false, false, false], resources: mockResources
        },
        mongodb: {
          icon: "🍃", title: "NoSQL MongoDB Database", sub: "Collections, Aggregation pipeline",
          desc: "Lưu trữ dữ liệu phi cấu trúc linh hoạt bằng MongoDB cho ứng dụng hiện đại.",
          status: "todo", pct: 0, cvMatch: false,
          checklist: ["Document insert, update, delete", "Complex queries & filtering", "Aggregation pipeline stages"],
          checkState: [false, false, false], resources: mockResources
        },
        airflow: {
          icon: "🛩️", title: "Apache Airflow Orchestration", sub: "DAGs, Operators, Scheduling",
          desc: "Lập lịch và quản lý workflows ETL phức tạp tự động bằng Airflow DAGs.",
          status: "todo", pct: 0, cvMatch: false,
          checklist: ["Define DAG workflows", "Configure Airflow operators & sensors", "Monitoring & alerting"],
          checkState: [false, false, false], resources: mockResources
        },
        monitoring: {
          icon: "📊", title: "Data Quality & Monitoring", sub: "Logging, Alerting, Metrics",
          desc: "Giám sát chất lượng dữ liệu và hiệu năng pipeline để phát hiện & sửa lỗi nhanh.",
          status: "todo", pct: 0, cvMatch: false,
          checklist: ["Data validation & profiling", "Setup alerting rules", "Log analysis & debugging"],
          checkState: [false, false, false], resources: mockResources
        },
        docker: {
          icon: "🐳", title: "Docker Containerization", sub: "Images, Containers, Docker Compose",
          desc: "Đóng gói data pipeline vào Docker containers để triển khai và scale một cách dễ dàng.",
          status: "todo", pct: 0, cvMatch: false,
          checklist: ["Create Docker images", "Docker Compose multi-container setup", "Container networking & volumes"],
          checkState: [false, false, false], resources: mockResources
        }
      }
    };
  }

  if (norm === "mobile") {
    return {
      username: "Học Viên DevPath",
      role: "Mobile App Dev",
      roleEmoji: "📱",
      roleMeta: "10 kỹ năng cốt lõi · Lộ trình 3–6 tháng",
      score: 70,
      phases: [
        { label: "Nền tảng & Vòng đời", cls: "p1" },
        { label: "UI & Performance", cls: "p2" },
        { label: "Dữ liệu & Thông báo", cls: "p3" },
        { label: "Nâng cao & Triển khai", cls: "p4" }
      ],
      cols: [
        ["lifecycle", "arc", "hotreload"],
        ["_", "listview", "anr", "_"],
        ["_", "offlinedb", "fcm", "_"],
        ["bridge", "deeplink", "deployment"]
      ],
      connections: [
        ["lifecycle", "listview"], ["arc", "anr"], ["hotreload", "anr"],
        ["listview", "offlinedb"], ["anr", "offlinedb"], ["anr", "fcm"],
        ["offlinedb", "bridge"], ["fcm", "bridge"], ["fcm", "deeplink"],
        ["bridge", "deployment"], ["deeplink", "deployment"]
      ],
      nodes: {
        lifecycle: {
          icon: "🔄", title: "Android Activity Lifecycle", sub: "onCreate, onResume, onDestroy",
          desc: "Quản lý vòng đời các màn hình hệ điều hành Android tránh rò rỉ bộ nhớ.",
          status: "todo", pct: 0, cvMatch: false,
          checklist: ["onCreate & onDestroy setup", "onPause & onResume state", "Quản lý Activity state"],
          checkState: [false, false, false], resources: mockResources
        },
        arc: {
          icon: "🧠", title: "iOS Automatic Reference Counting", sub: "Memory management, Swift",
          desc: "Cơ chế đếm tham chiếu tự động để quản lý tài nguyên RAM trên iOS Swift.",
          status: "todo", pct: 0, cvMatch: false,
          checklist: ["Strong/Weak references", "Retain cycle prevention", "Deinit lifecycle check"],
          checkState: [false, false, false], resources: mockResources
        },
        hotreload: {
          icon: "⚡", title: "Stateful Hot Reload", sub: "React Native, Flutter",
          desc: "Xem ngay kết quả giao diện cập nhật sau khi sửa code mà không làm mất state.",
          status: "todo", pct: 0, cvMatch: false,
          checklist: ["Hot reload vs Hot restart", "Quản lý State khi reload", "Debugging trên simulator"],
          checkState: [false, false, false], resources: mockResources
        },
        listview: {
          icon: "📜", title: "Flutter ListView.builder", sub: "Dynamic scroll list, performance",
          desc: "Tối ưu hóa danh sách cuộn siêu dài bằng cách render phần tử trong màn hình.",
          status: "todo", pct: 0, cvMatch: false,
          checklist: ["ListView.builder usage", "Recycle items memory", "Pagination scrolling"],
          checkState: [false, false, false], resources: mockResources
        },
        anr: {
          icon: "⌛", title: "Main Thread Blocked (ANR)", sub: "Application Not Responding",
          desc: "Phòng tránh đơ ứng dụng bằng cách đẩy tác vụ nặng ra luồng chạy ngầm.",
          status: "todo", pct: 0, cvMatch: false,
          checklist: ["Phát hiện Main thread block", "Sử dụng Async/Isolate", "Tối ưu hóa UI rendering"],
          checkState: [false, false, false], resources: mockResources
        },
        bridge: {
          icon: "Bridge", title: "Cross-Platform Native Bridge", sub: "Native-JS communication",
          desc: "Cơ chế giao tiếp giữa luồng JavaScript và các API hệ thống Android/iOS.",
          status: "todo", pct: 0, cvMatch: false,
          checklist: ["Khởi tạo Native module", "Gửi dữ liệu qua Bridge", "Tối ưu hóa Bridge serialization"],
          checkState: [false, false, false], resources: mockResources
        },
        offlinedb: {
          icon: "💾", title: "Offline-First Local DB", sub: "SQLite, Realm",
          desc: "Thiết lập cơ sở dữ liệu cục bộ hỗ trợ chạy offline không cần internet.",
          status: "todo", pct: 0, cvMatch: false,
          checklist: ["SQLite database setup", "Realm Schema migration", "Đồng bộ hóa dữ liệu online"],
          checkState: [false, false, false], resources: mockResources
        },
        fcm: {
          icon: "🔔", title: "Firebase Cloud Messaging", sub: "Push notifications",
          desc: "Tích hợp luồng đẩy thông báo thời gian thực từ Cloud đến các thiết bị.",
          status: "todo", pct: 0, cvMatch: false,
          checklist: ["Đăng ký FCM token", "Nhận background notifications", "Xử lý click notification"],
          checkState: [false, false, false], resources: mockResources
        },
        deeplink: {
          icon: "🔗", title: "Mobile Deep Linking Flow", sub: "URL schemes, Universal Links",
          desc: "Điều hướng người dùng mở thẳng màn hình mong muốn từ link chia sẻ ngoài app.",
          status: "todo", pct: 0, cvMatch: false,
          checklist: ["Cấu hình Custom Scheme", "Universal/App links setup", "Parse tham số URL"],
          checkState: [false, false, false], resources: mockResources
        },
        deployment: {
          icon: "🚀", title: "App Store Deployment Requirements", sub: "App Store, Play Store",
          desc: "Các tiêu chuẩn đóng gói mã nguồn và phát hành ứng dụng lên các cửa hàng chính thức.",
          status: "todo", pct: 0, cvMatch: false,
          checklist: ["Đóng gói tệp tin AAB/IPA", "Cấu hình chứng chỉ Signing key", "Gửi kiểm duyệt store"],
          checkState: [false, false, false], resources: mockResources
        }
      }
    };
  }

  if (norm === "devops") {
    return {
      username: "Học Viên DevPath",
      role: "DevOps Engineer",
      roleEmoji: "⚙️",
      roleMeta: "10 kỹ năng cốt lõi · Lộ trình 6–9 tháng",
      score: 70,
      phases: [
        { label: "Quy trình phát triển", cls: "p1" },
        { label: "Cấu hình & Proxy", cls: "p2" },
        { label: "Hạ tầng & Triển khai", cls: "p3" },
        { label: "Giám sát & Vận hành", cls: "p4" }
      ],
      cols: [
        ["gitflow", "ci_pipeline", "_"],
        ["_", "nginx", "ansible", "sast"],
        ["_", "iac", "k8s", "bluegreen"],
        ["monitoring", "elk", "_"]
      ],
      connections: [
        ["gitflow", "ci_pipeline"], ["ci_pipeline", "nginx"], ["ci_pipeline", "ansible"], ["ci_pipeline", "sast"],
        ["nginx", "iac"], ["ansible", "iac"], ["sast", "iac"], ["nginx", "bluegreen"], ["ansible", "bluegreen"],
        ["iac", "k8s"], ["k8s", "monitoring"], ["bluegreen", "monitoring"],
        ["k8s", "elk"], ["bluegreen", "elk"]
      ],
      nodes: {
        gitflow: {
          icon: "🔀", title: "GitFlow Branching Strategy", sub: "Git branching model",
          desc: "Mô hình phân nhánh mã nguồn an toàn cô lập môi trường dev và production.",
          status: "todo", pct: 0, cvMatch: false,
          checklist: ["Nhánh develop vs main", "Tạo release branches", "Hotfix process"],
          checkState: [false, false, false], resources: mockResources
        },
        ci_pipeline: {
          icon: "⚙️", title: "Continuous Integration Pipelines", sub: "Jenkins, GitHub Actions",
          desc: "Tự động hóa toàn bộ việc kiểm tra, đóng gói mã nguồn khi đẩy code mới.",
          status: "todo", pct: 0, cvMatch: false,
          checklist: ["Viết file workflow CI", "Tích hợp Unit test tự động", "Build docker image tự động"],
          checkState: [false, false, false], resources: mockResources
        },
        nginx: {
          icon: "🌐", title: "Nginx Load Balancing Proxy", sub: "Reverse proxy, load balancer",
          desc: "Cấu hình reverse proxy chịu tải và cân bằng lưu lượng truy cập backend.",
          status: "todo", pct: 0, cvMatch: false,
          checklist: ["Cấu hình Reverse proxy rules", "Cân bằng tải Round-Robin", "Cài đặt SSL certificate"],
          checkState: [false, false, false], resources: mockResources
        },
        ansible: {
          icon: "🤖", title: "Ansible Configuration Idempotency", sub: "Configuration management",
          desc: "Đảm bảo cấu hình hệ thống đồng nhất dù chạy một hay nhiều lần trên host.",
          status: "todo", pct: 0, cvMatch: false,
          checklist: ["Viết Ansible Playbook", "Quản lý SSH inventory", "Thiết lập tasks đồng nhất"],
          checkState: [false, false, false], resources: mockResources
        },
        sast: {
          icon: "🔍", title: "SAST Vulnerability Scanning", sub: "Static security analysis",
          desc: "Quét lỗ hổng bảo mật trực tiếp trên mã nguồn tĩnh trước khi build sản phẩm.",
          status: "todo", pct: 0, cvMatch: false,
          checklist: ["Tích hợp công cụ quét mã nguồn", "Phân tích lỗ hổng CWE/OWASP", "Chặn pipeline nếu có lỗi cao"],
          checkState: [false, false, false], resources: mockResources
        },
        iac: {
          icon: "🧱", title: "Infrastructure as Code (IaC)", sub: "Terraform, CloudFormation",
          desc: "Định nghĩa và quản lý toàn bộ hạ tầng đám mây dạng tệp cấu hình code.",
          status: "todo", pct: 0, cvMatch: false,
          checklist: ["Viết Terraform config", "Quản lý state file", "Plan & Apply hạ tầng Cloud"],
          checkState: [false, false, false], resources: mockResources
        },
        k8s: {
          icon: "☸️", title: "Kubernetes Pod Deployment", sub: "K8s orchestration",
          desc: "Orchestration quản lý cụm Docker container quy mô lớn chạy tự động.",
          status: "todo", pct: 0, cvMatch: false,
          checklist: ["Tạo deployment manifest", "Quản lý Pods replicas", "Cấu hình Service & Ingress"],
          checkState: [false, false, false], resources: mockResources
        },
        bluegreen: {
          icon: "🟢", title: "Blue-Green Zero-Downtime", sub: "Deployment strategy",
          desc: "Chiến lược cập nhật ứng dụng song song giảm thiểu rủi ro gián đoạn dịch vụ.",
          status: "todo", pct: 0, cvMatch: false,
          checklist: ["Chạy song song Blue & Green environment", "Điều hướng traffic router", "Rollback nhanh khi có lỗi"],
          checkState: [false, false, false], resources: mockResources
        },
        monitoring: {
          icon: "📈", title: "Prometheus & Grafana Monitoring", sub: "Metrics, dashboards",
          desc: "Thu thập metrics phần cứng ứng dụng và biểu diễn bằng biểu đồ trực quan.",
          status: "todo", pct: 0, cvMatch: false,
          checklist: ["Cấu hình Prometheus scraper", "Tạo Grafana dashboard", "Thiết lập cảnh báo alerts"],
          checkState: [false, false, false], resources: mockResources
        },
        elk: {
          icon: "📋", title: "Centralized ELK Logging Stack", sub: "Log collection, analysis",
          desc: "Tập hợp log từ nhiều máy chủ về kho quản lý và tìm kiếm tập trung.",
          status: "todo", pct: 0, cvMatch: false,
          checklist: ["Cài đặt Logstash/Filebeat", "Elasticsearch index logs", "Kiếm tìm logs trên Kibana UI"],
          checkState: [false, false, false], resources: mockResources
        }
      }
    };
  }

  if (norm === "security") {
    return {
      username: "Học Viên DevPath",
      role: "Cyber Security",
      roleEmoji: "🛡️",
      roleMeta: "10 kỹ năng cốt lõi · Lộ trình 6–9 tháng",
      score: 70,
      phases: [
        { label: "Mật mã & Xác thực", cls: "p1" },
        { label: "An toàn Web & API", cls: "p2" },
        { label: "Phòng chống tấn công", cls: "p3" },
        { label: "Kiến trúc & Kiểm thử", cls: "p4" }
      ],
      cols: [
        ["aes", "salting", "ssl_tls"],
        ["_", "sqli", "idor", "_"],
        ["_", "phishing", "ddos", "_"],
        ["waf", "zerotrust", "pentest"]
      ],
      connections: [
        ["aes", "sqli"], ["salting", "sqli"], ["ssl_tls", "sqli"], ["salting", "idor"], ["ssl_tls", "idor"],
        ["sqli", "phishing"], ["idor", "phishing"], ["sqli", "ddos"], ["idor", "ddos"],
        ["phishing", "waf"], ["ddos", "waf"],
        ["waf", "zerotrust"], ["waf", "pentest"]
      ],
      nodes: {
        aes: {
          icon: "🔒", title: "Symmetric AES Encryption", sub: "AES-256, cryptography",
          desc: "Mã hóa đối xứng hiệu năng cao giúp bảo mật tập tin lưu trữ cục bộ.",
          status: "todo", pct: 0, cvMatch: false,
          checklist: ["Hiểu mã hóa AES-256", "Quản lý secret key an toàn", "Cipher modes (CBC/GCM)"],
          checkState: [false, false, false], resources: mockResources
        },
        salting: {
          icon: "🧂", title: "Password Salting Security", sub: "Bcrypt, hashing",
          desc: "Tránh giải ngược mật khẩu bằng cách ghép chuỗi ngẫu nhiên trước khi băm.",
          status: "todo", pct: 0, cvMatch: false,
          checklist: ["Sử dụng bcrypt salt rounds", "Bảo vệ chống Rainbow Table", "Kiểm tra độ phức tạp pass"],
          checkState: [false, false, false], resources: mockResources
        },
        ssl_tls: {
          icon: "🔑", title: "SSL/TLS Traffic Encryption", sub: "HTTPS, certificates",
          desc: "Mã hóa toàn bộ lưu lượng dữ liệu truyền qua môi trường internet bằng HTTPS.",
          status: "todo", pct: 0, cvMatch: false,
          checklist: ["SSL Handshake process", "TLS 1.3 configuration", "Certificate authority validation"],
          checkState: [false, false, false], resources: mockResources
        },
        sqli: {
          icon: "🛡️", title: "SQL Injection Mitigation", sub: "Prepared statements",
          desc: "Phòng chống tấn công chèn lệnh truy vấn SQL bằng tham số hóa câu lệnh.",
          status: "todo", pct: 0, cvMatch: false,
          checklist: ["Sử dụng Prepared Statements", "Lọc input của user", "Hạn chế quyền hạn DB user"],
          checkState: [false, false, false], resources: mockResources
        },
        idor: {
          icon: "🚪", title: "IDOR API Authorization Broken", sub: "Authorization check",
          desc: "Đảm bảo phân quyền chặt chẽ trước khi trả về đối tượng dựa trên ID yêu cầu.",
          status: "todo", pct: 0, cvMatch: false,
          checklist: ["Kiểm tra quyền sở hữu Object", "Tránh expose auto-increment ID", "Sử dụng UUID cho API"],
          checkState: [false, false, false], resources: mockResources
        },
        waf: {
          icon: "🧱", title: "Layer 7 WAF Deployment", sub: "Web application firewall",
          desc: "Cài đặt tường lửa web lọc các request nguy hiểm như SQLi, XSS ở cổng ngõ.",
          status: "todo", pct: 0, cvMatch: false,
          checklist: ["Cấu hình WAF rules", "Block malicious IPs", "Lọc OWASP Top 10 attacks"],
          checkState: [false, false, false], resources: mockResources
        },
        phishing: {
          icon: "🎣", title: "Social Engineering (Phishing)", sub: "Phishing prevention",
          desc: "Nhận biết và ngăn chặn các chiêu thức lừa đảo qua email, link giả mạo.",
          status: "todo", pct: 0, cvMatch: false,
          checklist: ["Kiểm tra domain SPF/DKIM", "Đào tạo nhận thức an toàn", "Bật Multi-Factor Auth (MFA)"],
          checkState: [false, false, false], resources: mockResources
        },
        ddos: {
          icon: "🌊", title: "DDoS Botnet Attack Profiles", sub: "Rate limiting, CDN",
          desc: "Hạn chế tấn công từ chối dịch vụ bằng cách giới hạn tần suất gửi request.",
          status: "todo", pct: 0, cvMatch: false,
          checklist: ["Cấu hình Rate Limiting", "Sử dụng CDN DDoS shield", "Phân tích botnet traffic patterns"],
          checkState: [false, false, false], resources: mockResources
        },
        zerotrust: {
          icon: "🛑", title: "Zero Trust Architecture", sub: "Identity verification",
          desc: "Mô hình bảo mật không tin tưởng bất cứ ai, bắt buộc xác thực ở mọi bước.",
          status: "todo", pct: 0, cvMatch: false,
          checklist: ["Xác thực định danh liên tục", "Phân quyền tối thiểu (Least privilege)", "Mã hóa dữ liệu nội bộ"],
          checkState: [false, false, false], resources: mockResources
        },
        pentest: {
          icon: "⚔️", title: "Penetration Testing Simulation", sub: "Ethical hacking",
          desc: "Kiểm thử xâm nhập giả lập để tìm lỗ hổng bảo mật hệ thống toàn diện.",
          status: "todo", pct: 0, cvMatch: false,
          checklist: ["Quét cổng port scanning", "Khai thác thử nghiệm an toàn", "Viết báo cáo vá lỗ hổng"],
          checkState: [false, false, false], resources: mockResources
        }
      }
    };
  }

  if (norm === "uiux") {
    return {
      username: "Học Viên DevPath",
      role: "UI/UX Designer",
      roleEmoji: "🎨",
      roleMeta: "10 kỹ năng cốt lõi · Lộ trình 3–6 tháng",
      score: 70,
      phases: [
        { label: "Nguyên lý cơ bản", cls: "p1" },
        { label: "Phác thảo & Quy trình", cls: "p2" },
        { label: "Tương tác & Khả dụng", cls: "p3" },
        { label: "Đo lường & Tối ưu", cls: "p4" }
      ],
      cols: [
        ["hierarchy", "negativespace", "rgb"],
        ["_", "wireframe", "flow", "_"],
        ["_", "designsystem", "microinteraction", "_"],
        ["fitts", "wcag", "abtesting"]
      ],
      connections: [
        ["hierarchy", "wireframe"], ["negativespace", "wireframe"], ["rgb", "wireframe"], ["hierarchy", "flow"], ["negativespace", "flow"],
        ["wireframe", "designsystem"], ["flow", "designsystem"], ["wireframe", "microinteraction"], ["flow", "microinteraction"],
        ["designsystem", "fitts"], ["microinteraction", "fitts"], ["designsystem", "wcag"], ["microinteraction", "wcag"],
        ["fitts", "abtesting"], ["wcag", "abtesting"]
      ],
      nodes: {
        hierarchy: {
          icon: "📐", title: "Visual Hierarchy Order", sub: "Sizing, contrast, placement",
          desc: "Nguyên lý phân cấp thị giác dẫn dắt mắt người đọc theo trình tự nội dung.",
          status: "todo", pct: 0, cvMatch: false,
          checklist: ["Sử dụng font size tương phản", "Định vị vị trí trung tâm", "Cân đối mật độ thông tin"],
          checkState: [false, false, false], resources: mockResources
        },
        negativespace: {
          icon: "🔲", title: "Negative Space Composition", sub: "White space, margins",
          desc: "Bố cục khoảng trống hợp lý tạo không gian thoáng giúp người dùng dễ thở.",
          status: "todo", pct: 0, cvMatch: false,
          checklist: ["Thiết lập padding/margins", "Phân tách các khối thông tin", "Tránh nhồi nhét quá nhiều UI"],
          checkState: [false, false, false], resources: mockResources
        },
        rgb: {
          icon: "🎨", title: "RGB Digital Display Gamut", sub: "RGB vs CMYK, digital color",
          desc: "Hiểu hệ màu RGB hiển thị chuyên nghiệp trên các thiết bị kỹ thuật số.",
          status: "todo", pct: 0, cvMatch: false,
          checklist: ["Chọn gam màu RGB chuẩn", "Tránh chọn màu CMYK in ấn", "Xây dựng color palette"],
          checkState: [false, false, false], resources: mockResources
        },
        wireframe: {
          icon: "✏️", title: "Wireframing Structural Layout", sub: "Lo-fi wireframes, layout",
          desc: "Vẽ bản phác thảo thô cấu trúc bố cục đen trắng định hình luồng đi của app.",
          status: "todo", pct: 0, cvMatch: false,
          checklist: ["Vẽ Lo-fi wireframe nhanh", "Sắp xếp bố cục nút bấm", "Xác nhận luồng chuyển trang"],
          checkState: [false, false, false], resources: mockResources
        },
        flow: {
          icon: "🔄", title: "UI Aesthetics vs UX Flow", sub: "User flow, usability",
          desc: "Cân đối giữa tính thẩm mỹ bên ngoài và độ mượt mà tiện dụng của luồng đi.",
          status: "todo", pct: 0, cvMatch: false,
          checklist: ["Xây dựng User Flow", "Tối giản số bước thao tác", "Đảm bảo tính dễ dùng (Usability)"],
          checkState: [false, false, false], resources: mockResources
        },
        designsystem: {
          icon: "📚", title: "Design System Scalability", sub: "Components, tokens",
          desc: "Xây dựng hệ thống thư viện component nhất quán và linh hoạt mở rộng nhanh.",
          status: "todo", pct: 0, cvMatch: false,
          checklist: ["Tạo UI components reusable", "Thiết lập Design Tokens", "Quy chuẩn khoảng cách spacing"],
          checkState: [false, false, false], resources: mockResources
        },
        microinteraction: {
          icon: "✨", title: "Micro-interaction UI Animation", sub: "Hover effects, feedbacks",
          desc: "Các hiệu ứng phản hồi nhỏ tinh tế tăng tính sinh động khi tương tác.",
          status: "todo", pct: 0, cvMatch: false,
          checklist: ["Thiết kế hover states", "Animation chuyển trang mượt", "Phản hồi lỗi/thành công nhẹ"],
          checkState: [false, false, false], resources: mockResources
        },
        fitts: {
          icon: "🎯", title: "Fitts's Law UX Target", sub: "Target size, distance",
          desc: "Định luật UX thiết kế nút bấm có kích thước và khoảng cách dễ chạm tay.",
          status: "todo", pct: 0, cvMatch: false,
          checklist: ["Nút bấm chính đủ to", "Đặt ở vị trí ngón cái dễ với", "Tránh đặt nút xóa quá gần nút lưu"],
          checkState: [false, false, false], resources: mockResources
        },
        wcag: {
          icon: "👓", title: "WCAG Contrast Accessibility", sub: "Contrast ratio, WCAG AA",
          desc: "Quy chuẩn độ tương phản màu sắc chữ và nền giúp người dùng dễ đọc.",
          status: "todo", pct: 0, cvMatch: false,
          checklist: ["Check tương phản tối thiểu 4.5:1", "Thiết kế hỗ trợ người mù màu", "Đặt font size dễ đọc"],
          checkState: [false, false, false], resources: mockResources
        },
        abtesting: {
          icon: "⚖️", title: "A/B Testing Conversion Optimization", sub: "User testing, conversion",
          desc: "Đo lường, so sánh trải nghiệm thực tế của người dùng để tìm bản tối ưu nhất.",
          status: "todo", pct: 0, cvMatch: false,
          checklist: ["Chuẩn bị phiên bản A và B", "Đo lường click-through rate", "Phân tích hành vi cải thiện UX"],
          checkState: [false, false, false], resources: mockResources
        }
      }
    };
  }

  // DEFAULT FALLBACK: Backend Developer
  return {
    username: "Học Viên DevPath",
    role: "Backend Engineer",
    roleEmoji: "⚙️",
    roleMeta: "10 kỹ năng cốt lõi · Lộ trình 3–6 tháng",
    score: 70,
    phases: [
      { label: "Nền tảng IT", cls: "p1" },
      { label: "Ngôn ngữ & API", cls: "p2" },
      { label: "Cơ sở dữ liệu", cls: "p3" },
      { label: "Hạ tầng Cloud", cls: "p4" }
    ],
    cols: [
      ["internet", "linux", "git"],
      ["_", "nodejs", "restapi", "_"],
      ["_", "sql", "nosql", "_"],
      ["auth", "docker", "redis"]
    ],
    connections: [
      ["internet", "nodejs"], ["linux", "nodejs"], ["git", "nodejs"],
      ["linux", "restapi"], ["git", "restapi"],
      ["nodejs", "sql"], ["nodejs", "nosql"],
      ["restapi", "sql"], ["restapi", "nosql"],
      ["sql", "auth"], ["nosql", "auth"],
      ["sql", "docker"], ["nosql", "redis"],
      ["auth", "docker"], ["auth", "redis"]
    ],
    nodes: {
      internet: {
        icon: "🌐", title: "Internet & HTTP", sub: "DNS, TCP/IP, HTTP Methods, Status codes",
        desc: "Thấu hiểu nguyên lý vận hành của Internet toàn cầu và cấu trúc giao thức HTTP làm tiền đề giao tiếp Client-Server.",
        status: "todo", pct: 0, cvMatch: false,
        checklist: ["HTTP methods: GET, POST, PUT, DELETE", "Status codes (2xx, 3xx, 4xx, 5xx)", "Hệ thống phân giải tên miền DNS", "Headers, Cookies và Session quản trị"],
        checkState: [false, false, false, false], resources: mockResources
      },
      linux: {
        icon: "🐧", title: "Linux Terminal", sub: "Terminal commands, File system, Permissions",
        desc: "Thành thạo kỹ năng thao tác trên dòng lệnh Terminal Linux, quản trị thư mục và phân quyền máy chủ VPS.",
        status: "todo", pct: 0, cvMatch: false,
        checklist: ["Điều hướng thư mục Linux nâng cao", "Quản trị quyền tệp tin: Chmod & Chown", "Quản lý tiến trình (Process Management)", "Cấu hình SSH kết nối Remote Server"],
        checkState: [false, false, false, false], resources: mockResources
      },
      git: {
        icon: "🔀", title: "Git & GitHub", sub: "Branching, merging, Pull Request flow",
        desc: "Quản lý phiên bản mã nguồn dự án chặt chẽ với Git, phối hợp nhóm hiệu quả qua GitHub Workflow.",
        status: "todo", pct: 0, cvMatch: false,
        checklist: ["Làm chủ Git add, commit, push, clone", "Phân nhánh Branch & xử lý Merge Conflict", "Tạo và kiểm duyệt Pull Request (PR)"],
        checkState: [false, false, false], resources: mockResources
      },
      nodejs: {
        icon: "🟢", title: "Node.js & Express", sub: "Event loop, Async, Middleware routing",
        desc: "Xây dựng ứng dụng máy chủ bất đồng bộ hiệu năng cao sử dụng môi trường Node.js và Express.",
        status: "todo", pct: 0, cvMatch: false,
        checklist: ["Event Loop single-thread", "Async/Await & Promises", "Middleware routes Express", "File system FS module"],
        checkState: [false, false, false, false], resources: mockResources
      },
      restapi: {
        icon: "⚡", title: "RESTful API Design", sub: "Endpoints, JSON, Status codes, Validation",
        desc: "Thiết kế chuẩn mực giao tiếp dữ liệu giữa Client và Server đáp ứng các tiêu chuẩn công nghiệp RESTful.",
        status: "todo", pct: 0, cvMatch: false,
        checklist: ["Quy chuẩn endpoints", "Phân trang, lọc, sắp xếp (Paging, Sorting)", "Sử dụng Zod/Joi validation"],
        checkState: [false, false, false], resources: mockResources
      },
      sql: {
        icon: "💾", title: "Relational DB (SQL)", sub: "PostgreSQL/MySQL, Joins, Indexing",
        desc: "Làm chủ cơ sở dữ liệu quan hệ, tối ưu câu lệnh truy vấn phức tạp và cấu hình chuẩn hóa sơ đồ thực thể.",
        status: "todo", pct: 0, cvMatch: false,
        checklist: ["Thiết kế bảng & Khóa ngoại", "INNER/LEFT/RIGHT JOIN queries", "Lập chỉ mục Indexing tối ưu"],
        checkState: [false, false, false], resources: mockResources
      },
      nosql: {
        icon: "🍃", title: "NoSQL (MongoDB)", sub: "Documents, Collections, Aggregation",
        desc: "Lưu trữ dữ liệu dạng phi cấu trúc linh hoạt linh động với MongoDB Document.",
        status: "todo", pct: 0, cvMatch: false,
        checklist: ["Tạo schema động collections", "Query array lồng nhau", "Aggregation Framework query"],
        checkState: [false, false, false], resources: mockResources
      },
      auth: {
        icon: "🔑", title: "Authentication JWT", sub: "Sessions, JWT Tokens, Cookies, RBAC",
        desc: "Bảo mật hệ thống đầu cuối nghiêm ngặt với giải pháp cấp phát token JWT ký điện tử.",
        status: "todo", pct: 0, cvMatch: false,
        checklist: ["Mã hóa bcrypt password", "Access/Refresh tokens setup", "Phân quyền RBAC"],
        checkState: [false, false, false, false], resources: mockResources
      },
      docker: {
        icon: "🐳", title: "Đóng gói Docker", sub: "Containers, Dockerfile, Docker Compose",
        desc: "Đóng gói toàn bộ ứng dụng và môi trường chạy vào bên trong Container nhằm triệt tiêu lỗi cục bộ.",
        status: "todo", pct: 0, cvMatch: false,
        checklist: ["Viết file Dockerfile tối ưu", "Docker Compose multi-service", "Docker Volume & Network"],
        checkState: [false, false, false], resources: mockResources
      },
      redis: {
        icon: "⚡", title: "Redis Caching", sub: "In-memory store, Cache patterns, TTL",
        desc: "Tăng cường năng lực xử lý chịu tải hệ thống gấp 10 lần nhờ giải pháp bộ nhớ đệm In-memory.",
        status: "todo", pct: 0, cvMatch: false,
        checklist: ["Cấu hình Cache-aside pattern", "Thiết lập TTL cache", "Sử dụng Redis cache store"],
        checkState: [false, false, false], resources: mockResources
      }
    }
  };
}
export default getDemoDataForRole;
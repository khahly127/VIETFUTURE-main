# 🔐 HƯỚNG DẪN PHÂN QUYỀN CHO DOANH NGHIỆP (ENTERPRISE)

## 📋 Tổng Quan

Hệ thống phân quyền cho doanh nghiệp cho phép quản lý chi tiết quyền hạn của các tài khoản enterprise. Mỗi enterprise sẽ nhận được các quyền mặc định khi đăng ký, và có thể được nâng cấp lên các quyền cao cấp khi cần.

---

## 🔑 Các Loại Quyền

### 1. **Quyền Mặc Định** (DEFAULT_ENTERPRISE_PERMISSIONS)
Các quyền tự động được cấp cho enterprise khi đăng ký:
- `view:employees` - Xem danh sách nhân viên
- `view:assessment_results` - Xem kết quả bài test
- `view:roadmap` - Xem lộ trình học
- `view:courses` - Xem khóa học
- `access:ai_consultant` - Truy cập AI tư vấn
- `view:ai_chat_history` - Xem lịch sử chat AI
- `view:reports` - Xem báo cáo

### 2. **Quyền Cao Cấp** (PREMIUM_ENTERPRISE_PERMISSIONS)
Các quyền cần phải kích hoạt thêm/trả phí:
- `create:assessment` - Tạo bài đánh giá
- `export:assessment_report` - Xuất báo cáo bài test
- `create:roadmap` - Tạo lộ trình riêng
- `create:custom_course` - Tạo khóa học tùy chỉnh
- `generate:reports` - Tạo báo cáo
- `export:reports` - Xuất báo cáo
- `manage:company_settings` - Cài đặt công ty

### 3. **Quyền Quản Trị** (ADMIN_ONLY_PERMISSIONS)
Chỉ admin hoặc enterprise owner:
- `create:employee` - Tạo tài khoản nhân viên
- `update:employee` - Sửa thông tin nhân viên
- `delete:employee` - Xóa nhân viên
- `manage:team` - Quản lý team
- `view:billing` - Xem thông tin thanh toán

---

## 🚀 Cách Sử Dụng

### 1. **Kiểm Tra Quyền Trong Route**

#### Kiểm tra chỉ có enterprise/admin:
```typescript
import { authorizeEnterprise } from "../middleware/auth.middleware";

router.post("/create-assessment", 
    verifyToken, 
    authorizeEnterprise,  // ← Chỉ enterprise và admin có thể truy cập
    assessmentController.createAssessment
);
```

#### Kiểm tra quyền cụ thể:
```typescript
import { authorizeEnterpriseAction } from "../middleware/auth.middleware";
import { EnterprisePermission } from "../utils/permissions";

router.post("/generate-report",
    verifyToken,
    authorizeEnterpriseAction([
        EnterprisePermission.GENERATE_REPORTS,
        EnterprisePermission.EXPORT_REPORTS
    ]),
    reportController.generateReport
);
```

### 2. **Lấy Thông Tin User Trong Controller**

```typescript
export const someController = async (req: Request, res: Response) => {
    const user = (req as any).user; // Lấy thông tin user từ token
    
    console.log(user.user_id);      // ID người dùng
    console.log(user.email);        // Email
    console.log(user.role);         // Role (enterprise, admin, student, etc)
    console.log(user.permissions);  // Danh sách quyền
    
    // Kiểm tra quyền
    if (user.permissions?.includes('view:employees')) {
        // Lấy danh sách nhân viên
    }
};
```

### 3. **Kiểm Tra Quyền Trong Service/Helper**

```typescript
import { hasEnterprisePermission } from "../utils/permissions";

export const checkUserPermission = (userPermissions: string[], requiredPerm: string): boolean => {
    return hasEnterprisePermission(userPermissions, requiredPerm);
};
```

---

## 📝 Ví Dụ Thực Tế

### Tạo endpoint cho enterprise xem nhân viên:

```typescript
// routes/employee.routes.ts
import express from 'express';
import { verifyToken, authorizeEnterprise } from '../middleware/auth.middleware';
import { employeeController } from '../controllers/employee.controller';

const router = express.Router();

router.get("/",
    verifyToken,
    authorizeEnterprise,  // Chỉ enterprise/admin
    employeeController.getEmployees
);

export default router;
```

### Tạo endpoint với quyền cụ thể:

```typescript
// routes/report.routes.ts
import { authorizeEnterpriseAction } from '../middleware/auth.middleware';
import { EnterprisePermission } from '../utils/permissions';

router.post("/export",
    verifyToken,
    authorizeEnterpriseAction([EnterprisePermission.EXPORT_REPORTS]),
    reportController.exportReport
);
```

---

## 🔄 Flow Đăng Ký Enterprise

```
1. Enterprise điền form đăng ký
   ↓
2. Backend call registerService() với role = "enterprise"
   ↓
3. Tạo user với role = "enterprise" trong DB
   ↓
4. Cấp quyền mặc định (DEFAULT_ENTERPRISE_PERMISSIONS)
   ↓
5. Encode vào JWT token và trả về
   ↓
6. Frontend lưu token, sau đó các request sẽ mang token này
```

---

## 🎯 Flow Yêu Cầu API

```
1. Frontend gửi request + Bearer token
   ↓
2. Middleware verifyToken decode token, lấy permissions
   ↓
3. authorizeEnterprise() hoặc authorizeEnterpriseAction() kiểm tra quyền
   ↓
   ✓ Có quyền → tiếp tục xử lý
   ✗ Không quyền → trả về 403 Forbidden
```

---

## 💡 Mở Rộng Hệ Thống

### Nâng cấp enterprise lên premium:

```typescript
// Cập nhật các quyền mới
export const upgradeToPremium = async (userId: number) => {
    // Lấy enterprise từ DB
    const enterprise = await getEnterpriseById(userId);
    
    // Thêm quyền cao cấp
    const newPermissions = [
        ...DEFAULT_ENTERPRISE_PERMISSIONS,
        ...PREMIUM_ENTERPRISE_PERMISSIONS
    ];
    
    // Lưu vào DB (nếu có table lưu permissions)
    // hoặc regenerate token mới khi đăng nhập lại
};
```

---

## ⚙️ File Liên Quan

| File | Mục Đích |
|------|---------|
| `src/middleware/auth.middleware.ts` | Middleware kiểm tra quyền |
| `src/utils/permissions.ts` | Định nghĩa các quyền |
| `src/utils/jwt.ts` | Generate JWT token với permissions |
| `src/services/auth.service.ts` | Service xử lý đăng ký/đăng nhập |

---

## 🧪 Test Phân Quyền

```bash
# Test đăng ký enterprise
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "company@example.com",
    "password": "secure123",
    "full_name": "Company Name",
    "role": "enterprise"
  }'

# Copy token từ response

# Test kiểm tra quyền
curl -X GET http://localhost:3000/api/employees \
  -H "Authorization: Bearer <TOKEN>"
```

---

**Cập nhật**: 2025-06-05

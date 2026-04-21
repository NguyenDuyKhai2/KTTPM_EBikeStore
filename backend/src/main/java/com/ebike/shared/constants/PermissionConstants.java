package com.ebike.shared.constants;

public final class PermissionConstants {

    private PermissionConstants() {
    }

    public static final class Guest {
        public static final String PRODUCT_VIEW = "product:view";
        public static final String PRODUCT_SEARCH = "product:search";
        public static final String CATEGORY_VIEW = "category:view";
        public static final String REVIEW_VIEW = "review:view";
        public static final String ORDER_CREATE = "order:create";
        public static final String PAYMENT_CREATE = "payment:create";

        private Guest() {
        }
    }

    public static final class Customer {
        public static final String ORDER_CREATE = "order:create";
        public static final String ORDER_VIEW_OWN = "order:view-own";
        public static final String ORDER_CANCEL_OWN = "order:cancel-own";
        public static final String PAYMENT_CREATE = "payment:create";
        public static final String PAYMENT_VIEW_OWN = "payment:view-own";
        public static final String FAVORITE_VIEW = "favorite:view";
        public static final String FAVORITE_UPDATE = "favorite:update";
        public static final String PROFILE_VIEW = "profile:view";
        public static final String PROFILE_UPDATE = "profile:update";
        public static final String REVIEW_CREATE = "review:create";

        private Customer() {
        }
    }

    public static final class ProductManagement {
        public static final String PRODUCT_CREATE = "product:create";
        public static final String PRODUCT_UPDATE = "product:update";
        public static final String PRODUCT_DELETE = "product:delete";
        public static final String PRODUCT_MANAGE_STOCK = "product:manage-stock";
        public static final String CATEGORY_MANAGE = "category:manage";
        public static final String REVIEW_MODERATE = "review:moderate";

        private ProductManagement() {
        }
    }

    public static final class OrderManagement {
        public static final String ORDER_VIEW_ALL = "order:view-all";
        public static final String ORDER_UPDATE_STATUS = "order:update-status";
        public static final String ORDER_ASSIGN_SHIPMENT = "order:assign-shipment";
        public static final String PAYMENT_VERIFY = "payment:verify";
        public static final String PAYMENT_REFUND = "payment:refund";
        public static final String SHIPMENT_MANAGE = "shipment:manage";

        private OrderManagement() {
        }
    }

    public static final class UserManagement {
        public static final String USER_VIEW = "user:view";
        public static final String USER_MANAGE = "user:manage";
        public static final String ROLE_MANAGE = "role:manage";
        public static final String PERMISSION_MANAGE = "permission:manage";

        private UserManagement() {
        }
    }

    public static final class ChatbotManagement {
        public static final String CHATBOT_USE = "chatbot:use";
        public static final String CHATBOT_VIEW_HISTORY = "chatbot:view-history";
        public static final String CHATBOT_MANAGE_FAQ = "chatbot:manage-faq";
        public static final String CHATBOT_MANAGE_KNOWLEDGE = "chatbot:manage-knowledge";
        public static final String CHATBOT_CONFIGURE = "chatbot:configure";

        private ChatbotManagement() {
        }
    }

    public static final class Admin {
        public static final String DASHBOARD_VIEW = "dashboard:view";
        public static final String REPORT_VIEW = "report:view";
        public static final String SYSTEM_CONFIG = "system:config";
        public static final String AUDIT_LOG_VIEW = "audit-log:view";

        private Admin() {
        }
    }
}

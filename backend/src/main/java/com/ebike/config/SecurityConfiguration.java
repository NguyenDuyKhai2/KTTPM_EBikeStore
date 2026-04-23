package com.ebike.config;

import com.ebike.authModule.filter.JwtAuthenticationFilter;
import com.ebike.shared.constants.PermissionConstants;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableMethodSecurity
public class SecurityConfiguration {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfiguration(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> {})
            .csrf(AbstractHttpConfigurer::disable)
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .anonymous(anonymous -> anonymous.authorities(
                PermissionConstants.Guest.PRODUCT_VIEW,
                PermissionConstants.Guest.PRODUCT_SEARCH,
                PermissionConstants.Guest.CATEGORY_VIEW,
                PermissionConstants.Guest.REVIEW_VIEW,
                PermissionConstants.Guest.ORDER_CREATE,
                PermissionConstants.Guest.PAYMENT_CREATE,
                PermissionConstants.ChatbotManagement.CHATBOT_USE
            ))
            .authorizeHttpRequests(authorize -> authorize
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/orders/quote").permitAll()
                .requestMatchers("/payments/vnpay/ipn", "/payments/vnpay/return").permitAll()
                .requestMatchers(
                    "/auth/register",
                    "/auth/login",
                    "/auth/login/**",
                    "/auth/logout",
                    "/auth/session",
                    "/health/**",
                    "/media/**",
                    "/error"
                ).permitAll()
                .requestMatchers(HttpMethod.GET, "/products/**").hasAuthority(PermissionConstants.Guest.PRODUCT_VIEW)
                .requestMatchers(HttpMethod.GET, "/showrooms").hasAuthority(PermissionConstants.Guest.PRODUCT_VIEW)
                .requestMatchers(HttpMethod.POST, "/chatbot/ask").hasAuthority(PermissionConstants.ChatbotManagement.CHATBOT_USE)
                .requestMatchers(HttpMethod.POST, "/chatbot/debug").hasAuthority(PermissionConstants.ChatbotManagement.CHATBOT_CONFIGURE)
                .requestMatchers(HttpMethod.GET, "/auth/profile").authenticated()
                .requestMatchers(HttpMethod.PUT, "/auth/profile").authenticated()
                .requestMatchers("/auth/**").authenticated()
                .requestMatchers(HttpMethod.GET, "/orders", "/orders/*").hasAnyAuthority(
                    PermissionConstants.Customer.ORDER_VIEW_OWN,
                    PermissionConstants.OrderManagement.ORDER_VIEW_ALL
                )
                .requestMatchers(HttpMethod.POST, "/orders").hasAuthority(PermissionConstants.Guest.ORDER_CREATE)
                .requestMatchers(HttpMethod.PATCH, "/orders/*/status").hasAuthority(PermissionConstants.OrderManagement.ORDER_UPDATE_STATUS)
                .requestMatchers(HttpMethod.GET, "/favorites").hasAuthority(PermissionConstants.Customer.FAVORITE_VIEW)
                .requestMatchers(HttpMethod.POST, "/favorites").hasAuthority(PermissionConstants.Customer.FAVORITE_UPDATE)
                .requestMatchers(HttpMethod.DELETE, "/favorites/*").hasAuthority(PermissionConstants.Customer.FAVORITE_UPDATE)
                .requestMatchers(HttpMethod.POST, "/payments/vnpay/create").hasAuthority(PermissionConstants.Guest.PAYMENT_CREATE)
                .requestMatchers(HttpMethod.GET, "/users/**").hasAnyAuthority(
                    PermissionConstants.Customer.PROFILE_VIEW,
                    PermissionConstants.UserManagement.USER_VIEW
                )
                .requestMatchers(HttpMethod.POST, "/users/**").hasAuthority(PermissionConstants.Customer.PROFILE_UPDATE)
                .requestMatchers(HttpMethod.PUT, "/users/**").hasAuthority(PermissionConstants.Customer.PROFILE_UPDATE)
                .requestMatchers(HttpMethod.POST, "/admin/product-images").hasAuthority(PermissionConstants.ProductManagement.PRODUCT_CREATE)
                .requestMatchers(HttpMethod.GET, "/admin/product-images/**").hasAuthority(PermissionConstants.ProductManagement.PRODUCT_UPDATE)
                .requestMatchers(HttpMethod.PUT, "/admin/product-images/**").hasAuthority(PermissionConstants.ProductManagement.PRODUCT_UPDATE)
                .requestMatchers(HttpMethod.DELETE, "/admin/product-images/**").hasAuthority(PermissionConstants.ProductManagement.PRODUCT_DELETE)
                .requestMatchers("/customer/**").hasAnyAuthority(
                    PermissionConstants.Customer.PROFILE_VIEW,
                    PermissionConstants.OrderManagement.ORDER_VIEW_ALL
                )
                .requestMatchers("/manager/**").hasAuthority(PermissionConstants.OrderManagement.ORDER_VIEW_ALL)
                .requestMatchers("/admin/**").hasAuthority(PermissionConstants.AccessControl.PERMISSION_MANAGE)
                .anyRequest().denyAll()
            )
            .exceptionHandling(exceptions -> exceptions
                .authenticationEntryPoint((request, response, exception) -> {
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.setContentType("application/json");
                    response.getWriter().write("{\"message\":\"Unauthorized\"}");
                })
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}

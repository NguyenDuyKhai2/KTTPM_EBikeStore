package com.ebike.productModule.controller;

import com.ebike.productModule.dto.response.ProductDetailDto;
import com.ebike.productModule.dto.response.ProductSummaryDto;
import com.ebike.productModule.service.ProductService;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public List<ProductSummaryDto> getProducts(
        @RequestParam(required = false) String query,
        @RequestParam(required = false) Integer categoryId,
        @RequestParam(required = false) BigDecimal minPrice,
        @RequestParam(required = false) BigDecimal maxPrice
    ) {
        return productService.getProducts(query, categoryId, minPrice, maxPrice);
    }

    @GetMapping("/{slug}")
    public ProductDetailDto getProductBySlug(@PathVariable String slug) {
        return productService.getProductBySlug(slug);
    }
}

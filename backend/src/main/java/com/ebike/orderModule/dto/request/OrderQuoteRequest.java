package com.ebike.orderModule.dto.request;

import java.util.List;

public record OrderQuoteRequest(List<OrderCreateItemRequest> items) {
}

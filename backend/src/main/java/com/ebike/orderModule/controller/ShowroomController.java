package com.ebike.orderModule.controller;

import com.ebike.orderModule.dto.response.ShowroomResponse;
import com.ebike.orderModule.entity.Showroom;
import com.ebike.orderModule.repository.ShowroomRepository;
import java.util.List;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/showrooms")
public class ShowroomController {

    private final ShowroomRepository showroomRepository;

    public ShowroomController(ShowroomRepository showroomRepository) {
        this.showroomRepository = showroomRepository;
    }

    @GetMapping
    @Transactional(readOnly = true)
    public List<ShowroomResponse> getShowrooms(@RequestParam(required = false) String district) {
        List<Showroom> showrooms = district == null || district.isBlank()
            ? showroomRepository.findByActiveTrueOrderByDistrictAscNameAsc()
            : showroomRepository.findByActiveTrueAndDistrictIgnoreCaseOrderByNameAsc(district.trim());

        return showrooms.stream()
            .map(showroom -> new ShowroomResponse(
                showroom.getId(),
                showroom.getName(),
                showroom.getCity(),
                showroom.getDistrict(),
                showroom.getAddress(),
                showroom.getPhone(),
                showroom.getOpeningHours(),
                showroom.getActive()
            ))
            .toList();
    }
}

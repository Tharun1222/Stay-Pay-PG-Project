package pgmanagement.service;

import org.springframework.stereotype.Service;
//import pgmanagement.entity.Franchise;
import pgmanagement.repository.FranchiseRepository;

import java.util.Comparator;
import java.util.List;
import java.util.Map;

@Service
public class FranchiseService {
    private final FranchiseRepository repository;

    public FranchiseService(FranchiseRepository repository) {
        this.repository = repository;
    }

   
public List<Map<String, Object>> findNearby(
        double latitude, double longitude
) {
    if (!Double.isFinite(latitude) || !Double.isFinite(longitude)
            || latitude < -90 || latitude > 90
            || longitude < -180 || longitude > 180) {
        throw new IllegalArgumentException("Invalid coordinates");
    }

    return repository.findAll().stream()
            .filter(f -> Boolean.TRUE.equals(f.getActive()))
            .filter(f -> f.getLatitude() != null && f.getLongitude() != null)
            .filter(f -> Double.isFinite(f.getLatitude())
                    && Double.isFinite(f.getLongitude()))
            .filter(f -> f.getLatitude() >= -90 && f.getLatitude() <= 90
                    && f.getLongitude() >= -180 && f.getLongitude() <= 180)
            .map(f -> {
                double distance = distanceKm(
                        latitude, longitude,
                        f.getLatitude(), f.getLongitude()
                );

                return Map.<String, Object>of(
                        "id", f.getId(),
                        "name", f.getName(),
                        "address", f.getAddress(),
                        "phone", f.getPhone(),
                        "foodType", f.getFoodType(),
                        "distanceKm", Math.round(distance * 10.0) / 10.0
                );
            })
            .filter(f -> (double) f.get("distanceKm") <= 30.0)
            .sorted(Comparator.comparingDouble(
                    f -> (double) f.get("distanceKm")
            ))
            .toList();
}
    private double distanceKm(
            double lat1, double lon1,
            double lat2, double lon2
    ) {
        double earthRadius = 6371.0;
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);

        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1))
                * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon / 2) * Math.sin(dLon / 2);

        return earthRadius * 2 * Math.atan2(
                Math.sqrt(a), Math.sqrt(1 - a)
        );
    }
}
package pgmanagement.service;

import org.springframework.stereotype.Service;
import pgmanagement.entity.Room;
import pgmanagement.repository.RoomRepository;

import java.util.List;

@Service
public class RoomService {
    private final RoomRepository repository;

    public RoomService(RoomRepository repository) {
        this.repository = repository;
    }

    public List<Room> getAll(boolean availableOnly) {
        return availableOnly
                ? repository.findByAvailableTrueOrderByRoomNoAsc()
                : repository.findAll();
    }

    public Room getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Room not found"));
    }

    public Room save(Room room) {
        validate(room);
        room.setId(null);
        return repository.save(room);
    }

    public Room update(Long id, Room details) {
        validate(details);
        Room room = getById(id);
        room.setRoomNo(details.getRoomNo());
        room.setRoomType(details.getRoomType());
        room.setCapacity(details.getCapacity());
        room.setAvailableBeds(details.getAvailableBeds());
        room.setRent(details.getRent());
        room.setFacilities(details.getFacilities());
        room.setImageUrl(details.getImageUrl());
        room.setAvailable(details.getAvailable());
        return repository.save(room);
    }

    public void delete(Long id) {
        repository.delete(getById(id));
    }

    private void validate(Room room) {
        if (room.getRoomNo() == null || room.getRoomNo().isBlank() ||
            room.getRoomType() == null || room.getRoomType().isBlank() ||
            room.getCapacity() == null || room.getCapacity() < 1 ||
            room.getAvailableBeds() == null || room.getAvailableBeds() < 0 ||
            room.getAvailableBeds() > room.getCapacity() ||
            room.getRent() == null || room.getRent() <= 0 ||
            room.getAvailable() == null) {
            throw new IllegalArgumentException("Invalid room details");
        }
    }
}
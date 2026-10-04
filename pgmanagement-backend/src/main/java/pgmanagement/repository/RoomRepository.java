package pgmanagement.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pgmanagement.entity.Room;
import java.util.List;

public interface RoomRepository extends JpaRepository<Room, Long> {
    List<Room> findByAvailableTrueOrderByRoomNoAsc();
}
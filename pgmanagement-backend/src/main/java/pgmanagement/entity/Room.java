package pgmanagement.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "room")
public class Room {


@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;

@Column(name = "room_no")
private String roomNo;

@Column(name = "room_type")
private String roomType;

private Integer capacity;

@Column(name = "available_beds", nullable = false)
private Integer availableBeds;

private Double rent;

private Boolean available;

@Column(length = 1000)
private String facilities;

@Column(name = "image_url", length = 1000)
private String imageUrl;

public Room() {
}

public Long getId() {
    return id;
}

public void setId(Long id) {
    this.id = id;
}

public String getRoomNo() {
    return roomNo;
}

public void setRoomNo(String roomNo) {
    this.roomNo = roomNo;
}

public String getRoomType() {
    return roomType;
}

public void setRoomType(String roomType) {
    this.roomType = roomType;
}

public Integer getCapacity() {
    return capacity;
}

public void setCapacity(Integer capacity) {
    this.capacity = capacity;
}

public Integer getAvailableBeds() {
    return availableBeds;
}

public void setAvailableBeds(Integer availableBeds) {
    this.availableBeds = availableBeds;
}

public Double getRent() {
    return rent;
}

public void setRent(Double rent) {
    this.rent = rent;
}

public Boolean getAvailable() {
    return available;
}

public void setAvailable(Boolean available) {
    this.available = available;
}

public String getFacilities() {
    return facilities;
}

public void setFacilities(String facilities) {
    this.facilities = facilities;
}

public String getImageUrl() {
    return imageUrl;
}

public void setImageUrl(String imageUrl) {
    this.imageUrl = imageUrl;
}


}

package pgmanagement.config;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<?> handleBadRequest(
            IllegalArgumentException ex
    ) {
        return ResponseEntity.badRequest().body(
                Map.of("message", ex.getMessage())
        );
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<?> handleNotFound(
            RuntimeException ex
    ) {
        if ("Room not found".equals(ex.getMessage()) ||
            "Enquiry not found".equals(ex.getMessage()) ||
            "Food trial not found".equals(ex.getMessage())) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    Map.of("message", ex.getMessage())
            );
        }

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                Map.of("message", ex.getMessage() == null
                        ? "Request failed" : ex.getMessage())
        );
    }
}
package app.companion.paudel;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.logging.Logger;

@SpringBootApplication
public class MyCompanionApplication {

    static Logger logger = Logger.getLogger(MyCompanionApplication.class.getName());
	public static void main(String[] args) {
		SpringApplication.run(MyCompanionApplication.class, args);
        logger.info("MyCompanionApplication started successfully.");
	}

}

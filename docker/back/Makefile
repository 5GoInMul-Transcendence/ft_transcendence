all:
	docker compose -f srcs/docker-compose.yml up
down:
	docker compose -f srcs/docker-compose.yml down
clean:
	docker system prune -a
fclean:
	docker stop $$(docker ps -qa)
	docker system prune --all --force --volumes
re: clean
	docker compose -f srcs/docker-compose.yml up --build
.PHONY	: all clean fclean re
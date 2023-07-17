all:
	docker compose -f srcs/docker-compose.yml up
clean:
	docker system prune -a
fclean:
	docker stop $$(docker ps -qa)
	docker system prune --all --force --volumes
re: clean
	make all
.PHONY	: all clean fclean re
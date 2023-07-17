all:
	docker compose up
clean:
	docker system prune -a
fclean:
	docker stop $$(docker ps -qa)
	docker system prune --all --force --volumes
re: fclean
	make all
.PHONY	: all clean fclean re
# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: kipark <kipark@student.42seoul.kr>         +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2023/04/04 21:09:36 by kipark            #+#    #+#              #
#    Updated: 2023/04/05 15:21:33 by kipark           ###   ########seoul.kr   #
#                                                                              #
# **************************************************************************** #

DOCKER_COMPOSE = docker-compose
DOCKER_COMPOSE_FILE = ./srcs/docker-compose.yml

all:
	mkdir -p ${HOME}/data/wordpress
	mkdir -p ${HOME}/data/mariadb
	$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) up --build

down:
	$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) down

up:
	$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) up

clean:
	$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) down --rmi all --volumes
	
fclean:
	make clean
	rm -rf ${HOME}/data

re:
	make fclean
	make all

.PHONY: all clean fclean re
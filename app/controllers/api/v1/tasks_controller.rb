module Api
	module V1
		class TasksController < ApplicationController
			protect_from_forgery with: :null_session
				
			def index
				tasks = Task.all

				render json: TaskSerializer.new(tasks).serializable_hash.to_json
			end

			def show
				task = Task.find_by(id: params[:id])

				render json: TaskSerializer.new(task).serializable_hash.to_json
			end

			def create
				task = Task.new(task_params)
        if task.save
          render json: TaskSerializer.new(task).serializable_hash.to_json
        else
          render json: { error: task.errors.messages }, status: 422
        end
			end

			def update
        task = Task.find_by(id: params[:id])
        if task.update(task_params)
          render json: TaskSerializer.new(task).serializable_hash.to_json
        else
          render json: { error: task.errors.messages }, status: 422
        end
      end

			def destroy
        task = Task.find_by(id: params[:id])
        if task.destroy
          head :no_content
        else
          render json: { errors: task.errors }, status: 422
        end
      end
			
			private

			def task_params
				params.require(:task).permit(:name, :description, :starred, :lane_id)
			end

		end
	end
end
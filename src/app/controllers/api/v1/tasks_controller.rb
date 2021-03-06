class Api::V1::TasksController < ApplicationController
		
	def index
		tasks = Task.all

		render json: tasks
	end

	def show
		task = Task.find_by(id: params[:id])

		render json: task
	end

	def create
		task = Task.new(task_params)
        if task.save
          render json: task
        else
          render json: { error: task.errors.messages }, status: 422
        end
	end

	def update
        task = Task.find_by(id: params[:id])
        if task.update(task_params)
          render json: task
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
		params.require(:task).permit(:name, :description, :starred, :pos, :completed, :duedate, :lane_id)
	end

end
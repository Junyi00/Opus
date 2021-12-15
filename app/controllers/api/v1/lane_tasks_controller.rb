module Api
	module V1
		class LaneTasksController < ApplicationController
			protect_from_forgery with: :null_session

			def show
				tasks = Task.filter_by_lane_id(params[:lane_id])

				render json: TaskSerializer.new(tasks).serializable_hash.to_json
			end

		end
	end
end